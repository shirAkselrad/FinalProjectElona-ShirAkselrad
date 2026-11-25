const express = require("express");
const router = express.Router();

const getProducts = require("./getProducts");
const getProductImages = require("./getProductImages");
const getCategories = require("./getCategories");
const getFilterOptions = require("./getFilterOptions");
const getActivePromotion = require("./getActivePromotion");
const vatSettings = require("./vatSettings");
const getCustomerReviews = require("./getCustomerReviews");

router.use("/", getProducts);
router.use("/", getProductImages);
router.use("/", getCategories);
router.use("/", getFilterOptions);
router.use("/", getActivePromotion);
router.use("/", vatSettings);
router.use("/", getCustomerReviews);

module.exports = router;
