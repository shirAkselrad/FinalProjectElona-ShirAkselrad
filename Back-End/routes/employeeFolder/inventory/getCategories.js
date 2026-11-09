const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets all the categories
const getCategories = (req, res, next) => {
  const query = "select category_id, name from categories";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get categories",
      });
    req.categories = results;
    next();
  });
};

//this middleware gets category types
const getCategoryTypes = (req, res, next) => {
  const query =
    "select type_id, category_id, name, min_sales, sales_check_days from category_types";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get category types",
      });
    req.categoryTypes = results;
    next();
  });
};

//this path returns the categories with their types
router.get("/categories", getCategories, getCategoryTypes, (req, res) => {
  const categories = req.categories.map((category) => ({
    ...category,
    types: req.categoryTypes
      .filter((type) => type.category_id === category.category_id)
      .map(({ category_id, ...type }) => type),
  }));
  return res.status(200).json({
    success: true,
    categories,
  });
});

module.exports = router;
