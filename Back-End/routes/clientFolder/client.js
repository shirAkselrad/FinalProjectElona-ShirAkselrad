const express = require("express");
const router = express.Router();

const reviewsRoutes = require("./reviews/reviews");
const getOrderPointsRoutes=require("./payment/getOrderPoints");

router.use("/", reviewsRoutes);
router.use("/",getOrderPointsRoutes);

module.exports = router;
