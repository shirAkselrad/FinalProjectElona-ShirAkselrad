const express = require("express");
const router = express.Router();

const reviewsRoutes = require("./reviews/reviews");

router.use("/", reviewsRoutes);

module.exports = router;
