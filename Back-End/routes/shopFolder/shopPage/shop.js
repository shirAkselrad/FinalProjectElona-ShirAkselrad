const express = require("express");
const router = express.Router();

const getProducts = require("./getProducts");
const getProductImages = require("./getProductImages");
const getCategories = require("./getCategories");
const getFilterOptions = require("./getFilterOptions");
const getActivePromotion = require("./getActivePromotion");

router.use("/", getProducts);
router.use("/", getProductImages);
router.use("/", getCategories);
router.use("/", getFilterOptions);
router.use("/", getActivePromotion);

module.exports = router;
