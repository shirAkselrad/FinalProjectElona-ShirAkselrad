const express = require("express");
const router = express.Router();

const startCheckout = require("./startCheckout");
const getOrderSummary = require("./getOrderSummary");

router.use("/", startCheckout);
router.use("/", getOrderSummary);

module.exports = router;
