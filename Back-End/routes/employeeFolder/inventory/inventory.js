const express = require("express");
const router = express.Router();

const getCategories = require("./getCategories");
const getInventory = require("./getInventory");
const changeProductStatus = require("./changeProductStatus");
const getInventoryFilterOptions = require("./getInventoryFilterOptions");

router.use("/", getCategories);
router.use("/", getInventory);
router.use("/", changeProductStatus);
router.use("/", getInventoryFilterOptions);

module.exports = router;
