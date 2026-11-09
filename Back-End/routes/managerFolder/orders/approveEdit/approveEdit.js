const express = require("express");
const router = express.Router();

const {
  startEditTransaction,
  rollbackEdit,
} = require("../../../employeeFolder/orders/editOrder/editTransaction");

const getPendingEdit = require("./getPendingEdit");

const {
  approveEdit,
  updateOrderAndPoints,
  commitApproval,
} = require("./saveApprovedEdit");

// ROUTE
router.post(
  "/order/:order_id/approveEdit",
  startEditTransaction,
  getPendingEdit,
  approveEdit,
  updateOrderAndPoints,
  commitApproval,
);

module.exports = router;
