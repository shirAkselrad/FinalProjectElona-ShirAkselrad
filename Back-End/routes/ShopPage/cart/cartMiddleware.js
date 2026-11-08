const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

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
  const shipping = 0;

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

//this middleware add exists product (which the requested amount changed) or new product to the order_items table (cart)
const addOrUpdateCartItem = (req, res, next) => {
  const product = req.product;
  const existingItem = req.existingCartItem;

  const quantity = Number(existingItem?.quantity || 0) + req.requestedQuantity;
  const price = Number(product.price);
  const discount = Number(product.discount) || 0;
  const salePrice = Number((price * (1 - discount / 100)).toFixed(2));
  const totalPrice = Number((salePrice * quantity).toFixed(2));
  let query, params;
  if (existingItem) {
    query = `update order_items set quantity=?, product_price=?, discount_percentage=?, discounted_product_price=?, total_price=? where order_id=? and product_id=?`;
    params = [
      quantity,
      price,
      discount,
      salePrice,
      totalPrice,
      req.cartOrderId,
      product.product_id,
    ];
  } else {
    query = `insert into order_items (order_id, product_id, product_name, quantity,product_price, discount_percentage,discounted_product_price, total_price) values (?,?,?,?,?,?,?,?)`;
    params = [
      req.cartOrderId,
      product.product_id,
      product.name,
      quantity,
      price,
      discount,
      salePrice,
      totalPrice,
    ];
  }
  db.query(query, params, (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't save cart item",
      });
    next();
  });
};

//this middleware calculates the final price to payment and the total amount of products in the cart
const calculateCartTotals = (req, res, next) => {
  const query = `
    select coalesce(sum(quantity),0) as total_items,
          coalesce(sum(total_price),0) as total_price
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
    req.cartTotals = results[0];
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
  const query = `
  update orders
  set total_items=?,
      total_price=?,
      shipping=0,
      final_price=?,
      points_used=0
  where order_id=? and status='PROCESSING'
`;

  db.query(
    query,
    [
      req.cartTotals.total_items,
      req.cartTotals.total_price,
      req.cartTotals.total_price,
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
  select *,product_price as original_price,discount_percentage as discount,
         discounted_product_price as sale_price,
         (select path from files
          where files.product_id = order_items.product_id
          and file_number = 1 limit 1) as image
  from order_items
  where order_id=?
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

//this middleware update product's quantity in the cart and the total price of this product amount of pieces
const updateCartItemQuantity = (req, res, next) => {
  const quantity = req.requestedQuantity;
  const totalPrice = Number(
    (Number(req.cartItem.discounted_product_price) * quantity).toFixed(2),
  );
  const query = `update order_items set quantity=?, total_price=? where order_id=? and product_id=?`;

  db.query(
    query,
    [quantity, totalPrice, req.cartOrderId, req.product.product_id],
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

module.exports = {
  checkExisitingCart,
  createCartIfNeeded,
  addOrUpdateCartItem,
  calculateCartTotals,
  deleteEmptyCart,
  checkIfCartDeleted,
  updateCartTotals,
  getCartItems,
  getCartTotals,
  updateCartItemQuantity,
  removeCartItem,
};
