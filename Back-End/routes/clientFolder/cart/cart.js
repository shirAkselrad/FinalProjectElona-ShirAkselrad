const express = require("express");
const router = express.Router();

const addToCart = require("./addToCart");
const getCart = require("./getCart");
const updateQuantity = require("./updateQuantity");
const removeProduct = require("./removeProduct");

router.use("/", addToCart);
router.use("/", getCart);
router.use("/", updateQuantity);
router.use("/", removeProduct);

module.exports = router;
