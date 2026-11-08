const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

// GET ORDER SUMMARY

const getOrderSummary = (req, res, next) => {
  const query = `
  SELECT order_id, status, total_items, total_price,
    points_used, shipping, final_price, promotion_id,
    min_delivery_date, max_delivery_date,

    (SELECT discount_percentage
     FROM promotions_settings
     WHERE promotion_id = orders.promotion_id)
    AS general_discount_percentage,

    (SELECT max_redemption_percentage
     FROM points_settings LIMIT 1)
    AS max_redemption_percentage

  FROM orders
  WHERE order_id = ?
`;
  db.query(query, [req.params.order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order summary",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    req.orderSummary = results[0];
    next();
  });
};

const getOrderSummaryItems = (req, res, next) => {
  const query = `
    SELECT order_item_id, order_id, product_id,
      product_name, quantity,
      product_price AS original_price,
      discount_percentage AS discount,
      discounted_product_price AS sale_price,
      total_price, status, replaces_order_item_id
    FROM order_items
    WHERE order_id=?
    ORDER BY order_item_id
  `;
  db.query(query, [req.params.order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order products",
      });

    req.orderSummary.items = results;
    next();
  });
};

const calculateOrderSummary = (req, res, next) => {
  const order = req.orderSummary;
  const round = (value) => Number(value.toFixed(2));

  const originalItems = order.items.filter(
    (item) => item.replaces_order_item_id == null,
  );

  const originalTotal = originalItems.reduce(
    (sum, item) => sum + Number(item.original_price) * Number(item.quantity),
    0,
  );

  const productsTotal = originalItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0,
  );

  const discount = Number(order.general_discount_percentage || 0);

  const afterPromotions = round(productsTotal * (1 - discount / 100));

  order.original_total = round(originalTotal);
  order.total_after_promotions = afterPromotions;
  order.promotions_discount = round(originalTotal - afterPromotions);
  order.final_total = round(
    afterPromotions - Number(order.points_used) + Number(order.shipping),
  );

  next();
};

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

// START TRANSACTION

const startEditTransaction = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Database error",
      });

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Transaction error",
        });
      }

      req.connection = connection;
      next();
    });
  });
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

// SAVE EDITED ITEMS

const saveEditedItems = (req, res, next) => {
  const items = req.originalItems;
  let index = 0;

  const saveNext = () => {
    if (index === items.length) return next();

    const item = items[index++];

    const updateQuery = `update order_items
      set status='Inactive'
      where order_item_id=? and order_id=? and status='Active'`;

    req.connection.query(
      updateQuery,
      [item.order_item_id, req.params.order_id],
      (err, result) => {
        if (err) return rollbackEdit(err, req, res);

        if (result.affectedRows !== 1)
          return rollbackEdit(
            new Error("Couldn't update original item"),
            req,
            res,
          );
        if (item.newQuantity === 0) return saveNext();

        const insertQuery = `insert into order_items
          (order_id, product_id, product_name, quantity,
           discounted_product_price, total_price,
           discount_percentage, product_price,
           status, replaces_order_item_id)
          values (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)`;

        const newTotal = Number(
          (Number(item.discounted_product_price) * item.newQuantity).toFixed(2),
        );

        req.connection.query(
          insertQuery,
          [
            req.params.order_id,
            item.product_id,
            item.product_name,
            item.newQuantity,
            item.discounted_product_price,
            newTotal,
            item.discount_percentage,
            item.product_price,
            item.order_item_id,
          ],
          (err) => {
            if (err) return rollbackEdit(err, req, res);
            saveNext();
          },
        );
      },
    );
  };

  saveNext();
};

// ROLLBACK

const rollbackEdit = (err, req, res) => {
  console.error("Order edit error:", err);

  req.connection.rollback(() => {
    req.connection.release();

    res.status(err.status || 500).json({
      success: false,
      message: err.status ? err.message : "Couldn't save order changes",
    });
  });
};

// COMMIT

const commitEdit = (req, res) => {
  req.connection.commit((err) => {
    if (err) return rollbackEdit(err, req, res);

    req.connection.release();

    res.status(200).json({
      success: true,
      message: "Order changes submitted for manager approval",
    });
  });
};

// ROUTES

router.get(
  "/orders/:order_id/summary",
  getOrderSummary,
  getOrderSummaryItems,
  calculateOrderSummary,
  (req, res) => {
    return res.status(200).json({
      success: true,
      order: req.orderSummary,
    });
  },
);

router.post(
  "/orders/:order_id/edit",
  checkOrderEditable,
  checkEditedProducts,
  startEditTransaction,
  checkPendingEdit,
  getOriginalItems,
  saveEditedItems,
  commitEdit,
);

module.exports = router;
module.exports.startEditTransaction = startEditTransaction;
module.exports.rollbackEdit = rollbackEdit;
