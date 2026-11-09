const express = require("express");
const router = express.Router();

const checkReview = require("./checkReview");
const addReview = require("./addReview");

router.use("/", checkReview);
router.use("/", addReview);

module.exports = router;
