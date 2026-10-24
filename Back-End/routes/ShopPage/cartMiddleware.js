const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//This middleware checks if the user is client, in case it does then next, else matched message to the popup
const checkingRole = (req, res, next) => {
  const user = req.session.user;

  //no user is logged in
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please log in to add products to your cart",
    });
  }

  //user role is not client (cannot create new order)
  if (user.role !== "Client") {
    return res.status(403).json({
      success: false,
      message: "Only clients can add products to the cart",
    });
  }

  next();
};

//this middleware checks if the client already have an existing cart, if yes, saving the order id at req.cartOrderId else null
const checkExisitingCart = (req, res, next) => {
  const query = `select order_id from orders where client_email=? and status="PROCESSING" limit 1`;

  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check client's cart",
      });
    }
    //saving cartOrderId if not found saving as null
    req.cartOrderId = results.length > 0 ? results[0].order_id : null;
    next();
  });
};

//this middleware creates new cart (new order) in case the client doesn't have already a cart
const createCartIfNeeded = (req, res, next) => {
  if (req.cartOrderId !== null) return next();

  //the shipping price
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
      //now saving the new order id
      req.cartOrderId = results.insertId;
      next();
    },
  );
};

//this middleware checks if the requested amount of product to order are smaller than what the shop has in stock
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

    //the product doesn't exist in the inventory table
    if (results.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //saving products details
    req.product = results[0];
    //in case the requested quantity is bigger than what the shop has in stock
    if (quantity > req.product.quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough products in stock",
      });
    }

    //saving the requested quantity of product the clients wants to add to the cart
    req.requestedQuantity = Number(quantity);
    next();
  });
};

//this middleware checks if the requested product to add already exists in the cart
const checkExistingCartItem = (req, res, next) => {
  const query = `
    select product_id, quantity
    from order_items
    where order_id=? and product_id=?
    limit 1
  `;

  db.query(query, [req.cartOrderId, req.product.product_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check cart item",
      });
    }

    //in case the product exists in the cart saving all the info about it, else (the product doesn't already exist in the cart) null
    req.existingCartItem = results.length > 0 ? results[0] : null;

    //in case the product already exists saving the amount of the requested product that already exists in the cart (if it doesn't already exist 0)
    const quantityAlreadyInCart = req.existingCartItem
      ? req.existingCartItem.quantity
      : 0;

    //the amount of product to add to the cart
    const quantityToAdd = req.requestedQuantity;

    //the quantity of the requested product in stock
    const availableStock = req.product.quantity;

    //in case the requested amount (plus what is already exists in the cart) is bigger than the shop stock
    if (quantityAlreadyInCart + quantityToAdd > availableStock)
      return res.status(400).json({
        success: false,
        message: "Not enough products in stock",
      });

    next();
  });
};

//this middleware add exists product (which the requested amount changed) or new product to the order_items table (cart)
const addOrUpdateCartItem = (req, res, next) => {
  //the request product
  const product = req.product;
  //the amount of pieces of the product to add
  const quantityToAdd = req.requestedQuantity;
  //the original of single requested product
  const originalPrice = Number(product.price);
  //the discount precentage of single requested product
  const discountPrecentage = Number(product.discount);

  //calculating the final price of the requested amount of the product (single piece of product)
  const finalPrice = Number(
    (originalPrice * (1 - discountPrecentage / 100)).toFixed(2),
  );

  //if the product already exists in the cart
  if (req.existingCartItem) {
    //calculating the new quantity
    const newQuantity = req.existingCartItem.quantity + quantityToAdd;
    //calculating the final price
    const totalPrice = newQuantity * finalPrice;

    //updating the table with the new quantity of the requested product
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
  }
  //if the product doesn't already exists in the cart
  else {
    //calculating the final price
    const totalPrice = quantityToAdd * finalPrice;

    //adding a new product to the items_order
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

//this middleware calculates the final price to payment and the total amount of products in the cart
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

    //saving the cart totals (total price and total amount of products)
    req.cartTotals = {
      total_items: results[0].total_items || 0,
      total_price: results[0].total_price || 0,
    };

    next();
  });
};

//this middleware deletes an empty cart from the orders table
const deleteEmptyCart = (req, res, next) => {
  //checking if the cart is empty, if it does then deleting the cart
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

    //there is no active cart so the order id is null
    req.cartOrderId = null;
    //saving that the cart has been deleted
    req.cartDeleted = true;
    next();
  });
};


//this middleware checks if the cart was deleted, if it was resting all the req details about it, else, continue
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


//this middleware updates all the total values (total products in the cart, order price(includes discounts), final price- including the points and shippping price)
const updateCartTotals = (req, res, next) => {
  //saving the price after all the discounts 
  const totalAfterPromotions = Number(req.cartTotals.total_price);
  //the shipping price
  const shipping = 30; //WILL BE CHANGED

  //the amount of points the user can use in the order
  const pointsUsed = Math.min(
    Math.max(0, Number(req.clientPoints)),
    totalAfterPromotions,
  );

  //the final price of the oder after calculating all the discounts, the user's points and adding the shipping price 
  const finalPrice = Number(totalAfterPromotions - pointsUsed + shipping);
  //updating all the final prices 
  const query = `
  update orders
  set total_items=?,
      total_price=?,
      final_price=?,
      points_used=?
  where order_id=? and status='PROCESSING'
`;

  db.query(
    query,
    [
      req.cartTotals.total_items,
      totalAfterPromotions,
      finalPrice,
      pointsUsed,
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



//this middleware gets all the items of req.cartOrderId
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


//this middleware save the totals (total price-before points and shipping, and total amount of products )
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


//this middleware save the new requested quantity of the product
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



//this middleware checks if the product to update (quantity) exists in the cart 
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


//this middleware update product's quantity in the cart and the total price of this product amount of pieces 
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


//this middleware removes a product from the cart 
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


//this middleware gets the client's points and save them in req.clientPoints
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


//this middleware save all the order calculates results to display in front-end
const calculateOrderSummary = (req, res, next) => {
  const originalTotal = req.cartItems.reduce(
    (total, product) =>
      total + Number(product.original_price) * Number(product.quantity),
    0,
  );

  const totalAfterPromotions = Number(req.cartTotals.total_price);
  const promotionsDiscount = originalTotal - totalAfterPromotions;
  const shipping = Number(req.cartTotals.shipping);

  const pointsUsed = Math.min(
    Math.max(0, req.clientPoints),
    totalAfterPromotions,
  );

  const finalTotal = totalAfterPromotions - pointsUsed + shipping;

  req.orderSummary = {
    original_total: Number(originalTotal),
    promotions_discount: Number(promotionsDiscount),
    total_after_promotions: totalAfterPromotions,
    available_points: req.clientPoints,
    points_used: pointsUsed,
    shipping,
    final_total: Number(finalTotal),
  };

  const query = `update orders set final_price=?, points_used=? where order_id=? and client_email=? and status='PROCESSING'`;
  db.query(
    query,
    [finalTotal,pointsUsed, req.cartOrderId, req.session.user.email],
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


//this middleware saves the orderId of the order which it's status is PROCESSING
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
