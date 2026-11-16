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
  if (!req.cancellationDb)
    return res.status(status).json({
      success: false,
      message,
    });

  req.cancellationDb.rollback(() => {
    req.cancellationDb.release();
    req.cancellationDb = null;

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

      req.cancellationDb = connection;
      next();
    });
  });
};

// Check current order status
const checkOrderEditable = (req, res, next) => {
  const query = req.cancellationDb
    ? "select status from orders where order_id=? for update"
    : "select status from orders where order_id=?";

  const connection = req.cancellationDb || db;

  connection.query(query, [req.params.order_id], (err, results) => {
    if (err) {
      console.error("Check order status error:", err);
      return cancelError(req, res, 500, "Couldn't check order status");
    }

    if (!results.length) return cancelError(req, res, 404, "Order not found");

    const currentStatus = results[0].status;
    const newStatus = req.body.status;

    const allowed =
      (currentStatus === "PAID" &&
        ["SHIPPED", "CANCELED"].includes(newStatus)) ||
      (currentStatus === "SHIPPED" && newStatus === "COMPLETED");

    if (!allowed)
      return cancelError(req, res, 403, "Invalid order status transition");

    req.currentStatus = currentStatus;
    next();
  });
};

// Get order items before cancellation
const getCancellationItems = (req, res, next) => {
  if (req.body.status !== "CANCELED") return next();

  const query = `
    select order_item_id, status, replaces_order_item_id
    from order_items
    where order_id=?
    for update
  `;

  req.cancellationDb.query(query, [req.params.order_id], (err, results) => {
    if (err) return cancelError(req, res);

    req.orderItems = results;
    next();
  });
};

// Delete pending replacement items
const deletePendingReplacement = (req, res, next) => {
  if (req.body.status !== "CANCELED") return next();

  const pendingIds = req.orderItems
    .filter((item) => item.status === "Inactive")
    .map((item) => item.order_item_id);

  const replacements = req.orderItems.filter(
    (item) =>
      item.status === "Active" &&
      pendingIds.includes(item.replaces_order_item_id),
  );

  if (!replacements.length) return next();

  const replacementsIds = replacements.map((item) => item.order_item_id);

  const query = `
    delete from order_items
    where order_id=?
      and status='Active'
      and order_item_id in (?)
  `;

  req.cancellationDb.query(
    query,
    [req.params.order_id, replacementsIds],
    (err, result) => {
      if (err || result.affectedRows !== replacementsIds.length)
        return cancelError(req, res);

      next();
    },
  );
};

// Mark active order items as inactive
const markItemsInactive = (req, res, next) => {
  if (req.body.status !== "CANCELED") return next();

  const query = `
    update order_items
    set status='Inactive'
    where order_id=? and status='Active'
  `;

  req.cancellationDb.query(query, [req.params.order_id], (err) => {
    if (err) return cancelError(req, res);
    next();
  });
};

// Update order status
const updateStatus = (req, res, next) => {
  const { order_id } = req.params;
  const { status } = req.body;

  const query = `
    update orders
    set status=?
    where order_id=? and status=?
  `;

  const connection = req.cancellationDb || db;

  connection.query(
    query,
    [status, order_id, req.currentStatus],
    (err, result) => {
      if (err) {
        console.error("Update order status error:", err);
        return cancelError(req, res);
      }

      if (result.affectedRows !== 1)
        return cancelError(req, res, 409, "Order status couldn't be updated");

      next();
    },
  );
};

// Commit cancellation
const completeCancellation = (req, res, next) => {
  if (!req.cancellationDb) return next();

  req.cancellationDb.commit((err) => {
    if (err) return cancelError(req, res);

    req.cancellationDb.release();
    req.cancellationDb = null;

    next();
  });
};

// Update order status route
router.put(
  "/orders/:order_id/status",
  checkNewStatus,
  startCancellation,
  checkOrderEditable,
  getCancellationItems,
  deletePendingReplacement,
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
