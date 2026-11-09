const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();
const { rollbackEdit } = require("./editTransaction");

// CHECK ORDER

const checkOrderEditable = (req, res, next) => {
  const query = "select status from orders where order_id=?";

  db.query(query, [req.params.order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check order",
      });

    if (!results.length || results[0].status !== "PAID")
      return res.status(400).json({
        success: false,
        message: "Order cannot be edited",
      });

    next();
  });
};

// CHECK PRODUCTS

const checkEditedProducts = (req, res, next) => {
  const products = req.body?.products;

  if (!Array.isArray(products) || !products.length)
    return res.status(400).json({
      success: false,
      message: "No products to edit",
    });

  next();
};

// CHECK PENDING EDIT

const checkPendingEdit = (req, res, next) => {
  const query = `select order_item_id from order_items where order_id=? and status='Inactive'`;

  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) return rollbackEdit(err, req, res);

    if (results.length > 0) {
      const error = new Error("Order already has pending changes");
      error.status = 400;
      return rollbackEdit(error, req, res);
    }

    next();
  });
};

// GET ORIGINAL ITEMS

const getOriginalItems = (req, res, next) => {
  const query = `select * from order_items
    where order_id=? and status='Active'`;

  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) return rollbackEdit(err, req, res);

    const originals = [];

    for (const product of req.body.products) {
      const original = results.find(
        (item) => item.order_item_id === product?.order_item_id,
      );

      if (
        !original ||
        original.replaces_order_item_id != null ||
        !Number.isInteger(product.quantity) ||
        product.quantity < 0 ||
        product.quantity >= original.quantity ||
        originals.some((item) => item.order_item_id === original.order_item_id)
      ) {
        const error = new Error("Invalid quantity change");
        error.status = 400;
        return rollbackEdit(error, req, res);
      }

      originals.push({
        ...original,
        newQuantity: product.quantity,
      });
    }

    req.originalItems = originals;
    next();
  });
};

module.exports = {
  checkOrderEditable,
  checkEditedProducts,
  checkPendingEdit,
  getOriginalItems,
};
