const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

const checkingRole = (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please log in to add products to your cart",
    });
  }

  if (user.role !== "Client") {
    return res.status(403).json({
      success: false,
      message: "Only clients can add products to the cart",
    });
  }

  next();
};

const checkExisitingCart = (req, res, next) => {
  const query = `select order_id from orders where client_email=? and status="PROCESSING" limit 1`;

  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check client's cart",
      });
    }

    req.cartOrderId = results.length > 0 ? results[0].order_id : null;
    next();
  });
};

const createCartIfNeeded = (req, res, next) => {
  if (req.cartOrderId !== null) return next();

  const shipping = 30; //WILL BE CHANGED

  const query = `insert into orders (client_email, total_items, total_price,shipping, final_price, status) values (?,0,0,?,?, 'PROCESSING')`;

  //staring the order with 30 shekels payment
  db.query(
    query,
    [req.session.user.email, shipping, shipping],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't create client's cart",
        });
      }

      req.cartOrderId = results.insertId;
      next();
    },
  );
};

const checkProduct = (req, res, next) => {
  const { product_id, quantity } = req.body;
  const query = "select * from inventory where product_id=?";

  db.query(query, [product_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check product",
      });
    }

    if (results.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = results[0];

    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough products in stock",
      });
    }

    req.product = product;
    req.requestedQuantity = Number(quantity);
    next();
  });
};

const checkExistingCartItem = (req, res, next) => {
  const query = `
    select product_id, quantity
    from order_items
    where order_id=? and product_id=?
    limit 1
  `;

  db.query(query, [req.cartOrderId, req.product.product_id], (err, results) => {
    if (err) {
      console.log("Cart order ID:", req.cartOrderId);
      console.log("Product ID:", req.product.product_id);
      console.error("Error checking cart item:", err);

      return res.status(500).json({
        success: false,
        message: "Couldn't check cart item",
      });
    }

    req.existingCartItem = results.length > 0 ? results[0] : null;

    const quantityAlreadyInCart = req.existingCartItem
      ? req.existingCartItem.quantity
      : 0;

    const quantityToAdd = req.requestedQuantity;
    const availableStock = req.product.quantity;

    if (quantityAlreadyInCart + quantityToAdd > availableStock)
      return res.status(400).json({
        success: false,
        message: "Not enough products in stock",
      });

    next();
  });
};

const addOrUpdateCartItem = (req, res, next) => {
  const product = req.product;
  const quantityToAdd = req.requestedQuantity;
  const originalPrice = Number(product.price);
  const discountPrecentage = Number(product.discount);

  const finalPrice = Number(
    (originalPrice * (1 - discountPrecentage / 100)).toFixed(2),
  );

  if (req.existingCartItem) {
    const newQuantity = req.existingCartItem.quantity + quantityToAdd;
    const totalPrice = newQuantity * finalPrice;

    const query =
      "update order_items set quantity=?,product_price=?, total_price=? where product_id=? and order_id=?";

    db.query(
      query,
      [
        newQuantity,
        finalPrice,
        totalPrice,
        req.existingCartItem.product_id,
        req.cartOrderId,
      ],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Couldn't update cart item",
          });
        }

        next();
      },
    );
  } else {
    const totalPrice = quantityToAdd * finalPrice;

    const query =
      "insert into order_items (order_id, product_id, product_name,quantity, product_price, total_price) values (?,?,?,?,?,?)";

    db.query(
      query,
      [
        req.cartOrderId,
        product.product_id,
        product.name,
        quantityToAdd,
        finalPrice,
        totalPrice,
      ],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Couldn't add product to cart ",
          });
        }

        next();
      },
    );
  }
};

const calculateCartTotals = (req, res, next) => {
  const query = `
    select sum(quantity) as total_items,
           sum(total_price) as total_price
    from order_items
    where order_id=?
  `;

  db.query(query, [req.cartOrderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't calculate cart totals",
      });
    }

    req.cartTotals = {
      total_items: results[0].total_items || 0,
      total_price: results[0].total_price || 0,
    };

    next();
  });
};

const deleteEmptyCart = (req, res, next) => {
  if (Number(req.cartTotals.total_items) > 0) return next();
  const query =
    "delete from orders where order_id=? and client_email=? and status='PROCESSING'";
  db.query(query, [req.cartOrderId, req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't delete empty cart",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    req.cartOrderId = null;
    req.cartDeleted = true;
    next();
  });
};

const checkIfCartDeleted = (req, res, next) => {
  if (req.cartDeleted) {
    return res.status(200).json({
      success: true,
      message: "Last product removed and empty cart deleted",
      total_items: 0,
      total_price: 0,
    });
  }
  next();
};

const updateCartTotals = (req, res, next) => {
  const totalAfterPromotions = Number(req.cartTotals.total_price);
  const shipping = 30; //WILL BE CHANGED
  const pointsUsed = Math.min(
    Math.max(0, Number(req.clientPoints)),
    totalAfterPromotions,
  );

  const finalPrice = Number(totalAfterPromotions - pointsUsed + shipping);

  const query = `
  update orders
  set total_items=?,
      total_price=?,
      final_price=? 
  where order_id=? and status='PROCESSING'
`;

  db.query(
    query,
    [
      req.cartTotals.total_items,
      totalAfterPromotions,
      finalPrice,
      req.cartOrderId,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update cart totals",
        });
      }

      if (results.affectedRows === 0) {
        return res.status(409).json({
          success: false,
          message: "Cart is not avaliable",
        });
      }

      next();
    },
  );
};

const getCartItems = (req, res, next) => {
  if (req.cartOrderId === null) {
    req.cartItems = [];
    return next();
  }

  const query = `
    select *,
      (select price from inventory
       where inventory.product_id = order_items.product_id) as original_price,
      (select discount from inventory
       where inventory.product_id = order_items.product_id) as discount,
      (select path from files
       where files.product_id = order_items.product_id
       and file_number = 1 limit 1) as image
    from order_items
    where order_id = ?
  `;

  db.query(query, [req.cartOrderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get cart items",
      });
    }

    req.cartItems = results;
    next();
  });
};

const getCartTotals = (req, res, next) => {
  if (req.cartOrderId === null) {
    req.cartTotals = {
      total_items: 0,
      total_price: 0,
    };
    return next();
  }

  const query = `
   select total_items, total_price, shipping, final_price
from orders
where order_id = ?
  `;

  db.query(query, [req.cartOrderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get cart totals",
      });
    }

    if (results.length === 0) {
      return res.status(409).json({
        success: false,
        message: "Cart is not available",
      });
    }

    req.cartTotals = results[0];
    next();
  });
};

const checkNewQuantity = (req, res, next) => {
  const quantity = Number(req.body.quantity);

  if (quantity < 1) {
    return res.status(409).json({
      success: false,
      message: "Invalid quantity",
    });
  }

  req.newQuantity = quantity;
  next();
};

const checkCartItemForUpdate = (req, res, next) => {
  if (req.cartOrderId === null) {
    return res.status(409).json({
      success: false,
      message: "Cart not found",
    });
  }

  const query =
    "select product_id from order_items where order_id=? and product_id=? limit 1";

  db.query(query, [req.cartOrderId, req.product.product_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check cart item",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart",
      });
    }

    next();
  });
};

const updateCartItemQuantity = (req, res, next) => {
  const newQuantity = req.newQuantity;
  const product = req.product;

  const finalPrice = Number(
    (Number(product.price) * (1 - Number(product.discount) / 100)).toFixed(2),
  );

  const totalPrice = newQuantity * finalPrice;

  const query =
    "update order_items set quantity=?, product_price=?, total_price=? where order_id=? and product_id=?";

  db.query(
    query,
    [newQuantity, finalPrice, totalPrice, req.cartOrderId, product.product_id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update product quantity",
        });
      }

      next();
    },
  );
};

const removeCartItem = (req, res, next) => {
  const { product_id } = req.body;

  if (req.cartOrderId === null) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const query = "delete from order_items where order_id=? and product_id=?";

  db.query(query, [req.cartOrderId, product_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't remove product from cart",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    next();
  });
};

const getClientsPoints = (req, res, next) => {
  const query = "select points from users where email=?";

  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get client points",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    req.clientPoints = Number(results[0].points) || 0;
    next();
  });
};

const calculateOrderSummary = (req, res, next) => {
  const originalTotal = req.cartItems.reduce(
    (total, product) =>
      total + Number(product.original_price) * Number(product.quantity),
    0,
  );

  const totalAfterPromotions = Number(req.cartTotals.total_price);
  const promotionsDiscount = originalTotal - totalAfterPromotions;
  const shipping = Number(req.cartTotals.shipping);

  const pointUsed = Math.min(
    Math.max(0, req.clientPoints),
    totalAfterPromotions,
  );

  const finalTotal = totalAfterPromotions - pointUsed + shipping;

  req.orderSummary = {
    original_total: Number(originalTotal),
    promotions_discount: Number(promotionsDiscount),
    total_after_promotions: totalAfterPromotions,
    available_points: req.clientPoints,
    points_used: pointUsed,
    shipping,
    final_total: Number(finalTotal),
  };

  const query = `update orders set final_price=? where order_id=? and client_email=? and status='PROCESSING'`;
  db.query(
    query,
    [finalTotal, req.cartOrderId, req.session.user.email],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update final price",
        });
      }
      if (results.affectedRows === 0)
        return res.status(404).json({
          success: false,
          message: "Processing order not found",
        });
      req.cartTotals.final_price = Number(finalTotal);
      next();
    },
  );
};

const checkProcessingOrder = (req, res, next) => {
  const query =
    "select order_id from orders where client_email=? and status='PROCESSING' limit 1";

  db.query(query, [req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get processing order",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Processing order not found",
      });

    req.cartOrderId = results[0].order_id;
    next();
  });
};

module.exports = {
  checkingRole,
  checkExisitingCart,
  createCartIfNeeded,
  checkProduct,
  checkExistingCartItem,
  addOrUpdateCartItem,
  calculateCartTotals,
  deleteEmptyCart,
  checkIfCartDeleted,
  updateCartTotals,
  getCartItems,
  getCartTotals,
  checkNewQuantity,
  checkCartItemForUpdate,
  updateCartItemQuantity,
  removeCartItem,
  getClientsPoints,
  calculateOrderSummary,
  checkProcessingOrder,
};
