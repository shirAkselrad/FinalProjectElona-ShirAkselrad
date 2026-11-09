const express = require("express");
const router = express.Router();

const getPointsSettings = require("./getPointsSettings");
const updatePointsSettings = require("./updatePointsSettings");

router.use("/", getPointsSettings);
router.use("/", updatePointsSettings);

module.exports = router;
