const express = require("express");
const router = express.Router();

const getCategories = require("./getCategories");
const addCategory = require("./addCategory");
const addCategoryType = require("./addCategoryType");
const changeCategoryStatus = require("./changeCategoryStatus");
const changeCategoryTypeStatus = require("./changeCategoryTypeStatus");

router.use("/", getCategories);
router.use("/", addCategory);
router.use("/", addCategoryType);
router.use("/", changeCategoryStatus);
router.use("/", changeCategoryTypeStatus);

module.exports = router;
