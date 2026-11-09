const express = require("express");
const router = express.Router();

const {
  startEditTransaction,
} = require("../../../employeeFolder/orders/editOrder/editTransaction");

const {
  getPendingItems,
  rejectEdit,
  commitRejection,
} = require("./rejectEditProcess");

router.post(
  "/order/:order_id/rejectEdit",
  startEditTransaction,
  getPendingItems,
  rejectEdit,
  commitRejection,
);

module.exports = router;
