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

const saveEditedItems = require("./saveEditedItems");

const {
  startEditTransaction,
  rollbackEdit,
  commitEdit,
} = require("./editTransaction");

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
