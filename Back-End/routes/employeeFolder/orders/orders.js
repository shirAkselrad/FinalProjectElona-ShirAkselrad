const express = require("express");
const router = express.Router();

const getOrders = require("./getOrders");
const updateOrderStatus = require("./updateOrderStatus");
const refunds = require("./refunds/refunds");
const editOrder = require("./editOrder/editOrder");

router.use("/", getOrders);
router.use("/", updateOrderStatus);
router.use("/", refunds);
router.use("/", editOrder);

module.exports = router;
