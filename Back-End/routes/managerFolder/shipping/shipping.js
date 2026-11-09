const express = require("express");
const router = express.Router();

const getShippingSettings = require("./getShippingSettings");
const updateShippingSettings = require("./updateShippingSettings");

router.use("/", getShippingSettings);
router.use("/", updateShippingSettings);

module.exports = router;
