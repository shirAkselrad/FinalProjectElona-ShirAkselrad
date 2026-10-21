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

router.post("/changeProductStatus", (req, res) => {
  const { product_id, status } = req.body;
  const query = "update inventory set status=? where product_id=?";
  db.query(query, [status, product_id], (err, results) => {
    if (err) {
      console.error("Couldn't change product's status");
      return res.status(500).json({
        success: false,
        message: "Couldn't update product's status",
      });
    }
    console.log("update results: ", results);
    return res.status(200).json({
      success: true,
    });
  });
});

//This path returns all the inventory details from back-end to front-end
router.get("/inventory", (req, res) => {
  const query = "select  * from inventory";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Could not get inventory, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Could not get inventory",
      });
    }
    return res.status(200).json({
      success: true,
      inventory: results,
    });
  });
});

module.exports = router;
