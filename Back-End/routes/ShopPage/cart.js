const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//this middle ware check rather the user role is client. only clients can operate an order
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

//this middle ware check rather this client already have a cart, if yes, keeping the order id else null
const checkExisitingCart = (req, res, next) => {
  const query = `select order_id from orders where client_email=? and status="CART" limit 1`;
  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check client's cart",
      });
    }
    //keeping the cartOrderId in the req for saving the order_id for the continue code
    req.cartOrderId = results.length > 0 ? results[0].order_id : null;
    next();
  });
};

const createCartIfNeeded = (req, res, next) => {
  if (req.cartOrderId !== null) return next();

  const query = `insert into orders (client_email, total_items, total_price, status) values (?,0,0, 'CART')`;
  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't create client's cart",
      });
    }
    req.cartOrderId = results.insertId;
    next();
  });
};

//this middle ware checks if the wanted product exists and there is enough pieces from it
const checkProduct = (req, res, next) => {
  //the product_id and the amount of pieces the client wants to add to the cart
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
    //saving product details and the wanted quantity by the client
    req.product = product;
    req.requestedQuantity = Number(quantity);
    next();
  });
};

//This middleware check if the product already exists in the cart or needs to be created
const checkExistingCartItem = (req, res, next) => {
  const query = `select product_id
  , quantity from order_items where order_id=? and product_id=? limit 1`;
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

//This middleware resposible for updating or creating a new table record depance if the product exists or not
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

//This middleware calculate the total price and the total amount of products which have been add to the cart
const calculateCartTotals = (req, res, next) => {
  const query = `select sum(quantity) as total_items, sum(total_price) as total_price from order_items where order_id=?`;
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

//this middleware updates the total price and total amount of items the clients have in the cart
const updateCartTotals = (req, res, next) => {
  const query = `update orders set total_items=?, total_price=? where order_id=? and status='CART'`;
  db.query(
    query,
    [req.cartTotals.total_items, req.cartTotals.total_price, req.cartOrderId],
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
//This path is responsible to check if the user role is client before creating a new order
router.post(
  "/addToCart",
  checkingRole,
  checkProduct,
  checkExisitingCart,
  createCartIfNeeded,
  checkExistingCartItem,
  addOrUpdateCartItem,
  calculateCartTotals,
  updateCartTotals,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      order_id: req.cartOrderId,
    });
  },
);

//this middleware returns all the selected items of the current order
const getCartItems = (req, res, next) => {
  if (req.cartOrderId === null) {
    req.cartItems = [];
    return next();
  }
  const query =
    "select *, (select path from files where files.product_id=order_items.product_id and file_number=1 limit 1) as image from order_items where order_id=?";
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

  const query = `select total_items, total_price from orders where order_id=? and status="CART"`;
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

router.get(
  "/getCart",
  checkingRole,
  checkExisitingCart,
  getCartItems,
  getCartTotals,
  (req, res) => {
    return res.status(200).json({
      success: true,
      order_id: req.cartOrderId,
      items: req.cartItems,
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);

// This middleware checks if the requested product quantity is valid
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

//this middleware checks if the wanted product exists in the cart
const checkCartItemForUpdate = (req, res, next) => {
  if (req.cartOrderId === null) {
    //in case there is no cart
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

//This middle ware update the requested quantity of the select product in cart (while the wanted product already exists in the cart )
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

router.put(
  "/updateQuantity",
  checkingRole,
  checkNewQuantity,
  checkProduct,
  checkExisitingCart,
  checkCartItemForUpdate,
  updateCartItemQuantity,
  calculateCartTotals,
  updateCartTotals,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product Quantity updated successfully",
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);

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
router.delete(
  "/removeProduct",
  checkingRole,
  checkExisitingCart,
  removeCartItem,
  calculateCartTotals,
  updateCartTotals,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);
module.exports = router;
