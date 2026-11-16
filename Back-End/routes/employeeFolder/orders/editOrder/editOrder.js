const express = require("express");
const router = express.Router();

const {
  getOrderSummary,
  getOrderSummaryItems,
  calculateOrderSummary,
} = require("./getOrderSummary");

const {
  checkOrderEditable,
  checkEditedProducts,
  checkPendingEdit,
  getOriginalItems,
} = require("./checkOrderEdit");

const { saveEditedItems, cancelEmptyOrder } = require("./saveEditedItems");

const {
  startEditTransaction,
  rollbackEdit,
  commitEdit,
} = require("./editTransaction");

// ROUTES

router.get(
  "/orders/:order_id/summary",
  getOrderSummary, //getting all the order details
  getOrderSummaryItems, //get all the order items details
  calculateOrderSummary, //get all the totals details
  (req, res) => {
    return res.status(200).json({
      success: true,
      order: req.orderSummary,
    });
  },
);

router.post(
  "/orders/:order_id/edit",
  checkEditedProducts,
  startEditTransaction,
  checkOrderEditable,
  checkPendingEdit,
  getOriginalItems,
  saveEditedItems,
  cancelEmptyOrder,
  commitEdit,
);

module.exports = router;
module.exports.startEditTransaction = startEditTransaction;
module.exports.rollbackEdit = rollbackEdit;
