const express = require("express");
const router = express.Router();

const getDetails = require("./getDetails");
const updateDetails = require("./updateDetails");

router.use("/", getDetails);
router.use("/", updateDetails);

module.exports = router;
