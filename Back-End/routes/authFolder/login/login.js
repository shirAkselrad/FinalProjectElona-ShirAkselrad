const express = require("express");
const router = express.Router();

const getUser = require("./getUser");
const loginUser = require("./loginUser");

router.use("/", getUser);
router.use("/", loginUser);

module.exports = router;
