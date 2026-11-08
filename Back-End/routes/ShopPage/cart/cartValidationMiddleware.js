const dbSingleton = require("../../../dbSingleton");
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

const checkProduct = (req, res, next) => {
  const { product_id } = req.body;
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1)
    return res.status(400).json({
      success: false,
      message: "Invalid quantity",
    });
  const query = "select * from inventory where product_id=?";
  db.query(query, [product_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check product",
      });
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    const product = results[0];
    if (product.status !== "Active")
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    if (quantity > product.quantity)
      return res.status(400).json({
        success: false,
        message: "Not enough products in stock",
      });
    req.product = product;
    req.requestedQuantity = quantity;
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
    req.existingCartItem = results[0] || null;
    const quantityInCart = Number(req.existingCartItem?.quantity || 0);
    if (quantityInCart + req.requestedQuantity > Number(req.product.quantity))
      return res.status(400).json({
        success: false,
        message: "Not enough products in stock",
      });
    next();
  });
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
    "select product_id, discounted_product_price from order_items where order_id=? and product_id=? limit 1";

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
    req.cartItem = results[0];
    next();
  });
};

module.exports = {
  checkingRole,
  checkProduct,
  checkExistingCartItem,
  checkCartItemForUpdate,
};
