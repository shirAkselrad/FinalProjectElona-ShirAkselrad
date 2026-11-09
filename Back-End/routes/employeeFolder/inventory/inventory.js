const express = require("express");
const router = express.Router();

const getCategories = require("./getCategories");
const getInventory = require("./getInventory");
const changeProductStatus = require("./changeProductStatus");

router.use("/", getCategories);
router.use("/", getInventory);
router.use("/", changeProductStatus);

module.exports = router;
