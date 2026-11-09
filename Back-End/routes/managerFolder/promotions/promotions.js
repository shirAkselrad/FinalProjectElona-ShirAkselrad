const express = require("express");
const router = express.Router();

const getPromotions = require("./getPromotions");
const createPromotion = require("./createPromotion");
const activatePromotion = require("./activatePromotion");
const deactivatePromotion = require("./deactivatePromotion");

router.use("/", getPromotions);
router.use("/", createPromotion);
router.use("/", activatePromotion);
router.use("/", deactivatePromotion);

module.exports = router;
