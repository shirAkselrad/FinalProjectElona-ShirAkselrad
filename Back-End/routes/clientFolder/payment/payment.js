const express = require("express");
const router = express.Router();

const createOrder = require("./createOrder");
const captureOrder = require("./captureOrder");
const checkPayPalOrder = require("./checkPayPalOrder");
const recoverOrder = require("./recoverOrder");

router.use("/", createOrder);
router.use("/", captureOrder);
router.use("/", checkPayPalOrder);
router.use("/", recoverOrder);

module.exports = router;
