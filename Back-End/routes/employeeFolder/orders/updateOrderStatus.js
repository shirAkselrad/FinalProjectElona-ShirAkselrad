const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();
const { sendStatusEmail } = require("./emails/sendStatusEmail");

// Handle cancellation errors
const cancelError = (
  req,
  res,
  status = 500,
  message = "Couldn't cancel order",
) => {
  if (!req.connection)
    return res.status(status).json({
      success: false,
      message,
    });

  req.connection.rollback(() => {
    req.connection.release();
    req.connection = null;

    return res.status(status).json({
      success: false,
      message,
    });
  });
};

// Validate requested status
const checkNewStatus = (req, res, next) => {
  if (!["SHIPPED", "COMPLETED", "CANCELED"].includes(req.body?.status))
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });

  next();
};

// Start transaction only when canceling
const startCancellation = (req, res, next) => {
  if (req.body.status !== "CANCELED") return next();

  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get database connection",
      });

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();

        return res.status(500).json({
          success: false,
          message: "Couldn't start cancellation",
        });
      }

      req.connection = connection;
      next();
    });
  });
};

// Check current order status
const checkOrderEditable = (req, res, next) => {
  const query = req.connection
    ? "SELECT status FROM orders WHERE order_id=? FOR UPDATE"
    : "SELECT status FROM orders WHERE order_id=?";

  const connection = req.connection || db;

  connection.query(query, [req.params.order_id], (err, results) => {
    if (err) {
      console.error("Check order status error:", err);
      return cancelError(req, res, 500, "Couldn't check order status");
    }

    if (!results.length) return cancelError(req, res, 404, "Order not found");

    if (results[0].status !== "PAID")
      return cancelError(req, res, 403, "Only PAID orders can be updated");

    next();
  });
};

// Prevent cancellation while an edit is pending
const checkPendingEdit = (req, res, next) => {
  if (req.body.status !== "CANCELED") return next();

  const query = `
    SELECT order_item_id
    FROM order_items
    WHERE order_id=? AND status='Inactive'
  `;

  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) {
      console.error("Check pending edit error:", err);
      return cancelError(req, res);
    }

    if (results.length > 0)
      return cancelError(
        req,
        res,
        409,
        "Please approve or reject pending order changes before cancellation",
      );

    next();
  });
};

// Mark active order items as inactive
const markItemsInactive = (req, res, next) => {
  if (req.body.status !== "CANCELED") return next();

  const query = `
    UPDATE order_items
    SET status='Inactive'
    WHERE order_id=? AND status='Active'
  `;

  req.connection.query(query, [req.params.order_id], (err, result) => {
    if (err) {
      console.error("Update order items error:", err);
      return cancelError(req, res);
    }

    if (result.affectedRows === 0)
      return cancelError(
        req,
        res,
        409,
        "No active items found for cancellation",
      );

    next();
  });
};

// Update order status
const updateStatus = (req, res, next) => {
  const { order_id } = req.params;
  const { status } = req.body;

  const query = `
    UPDATE orders
    SET status=?
    WHERE order_id=? AND status='PAID'
  `;

  const connection = req.connection || db;

  connection.query(query, [status, order_id], (err, result) => {
    if (err) {
      console.error("Update order status error:", err);
      return cancelError(req, res);
    }

    if (result.affectedRows !== 1)
      return cancelError(req, res, 409, "Order status couldn't be updated");

    next();
  });
};

// Commit cancellation
const completeCancellation = (req, res, next) => {
  if (!req.connection) return next();

  req.connection.commit((err) => {
    if (err) return cancelError(req, res);

    req.connection.release();
    req.connection = null;

    next();
  });
};

// Update order status route
router.put(
  "/orders/:order_id/status",
  checkNewStatus,
  startCancellation,
  checkOrderEditable,
  checkPendingEdit,
  markItemsInactive,
  updateStatus,
  completeCancellation,
  sendStatusEmail,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  },
);

module.exports = router;
