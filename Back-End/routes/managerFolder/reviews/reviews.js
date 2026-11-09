const express = require("express");
const router = express.Router();

const getReviews = require("./getReviews");

router.use("/", getReviews);

module.exports = router;
