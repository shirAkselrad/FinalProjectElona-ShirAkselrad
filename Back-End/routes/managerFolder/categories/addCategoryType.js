const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware checks if a new category type already exists in the category
const checkTypeExists = (req, res, next) => {
  const { category_id, name } = req.body;
  const query =
    "select type_id from category_types where category_id=? and name=?";
  db.query(query, [category_id, name], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check category type",
      });
    if (results.length > 0)
      return res.status(409).json({
        success: false,
        message: "Category type already exists",
      });
    next();
  });
};

//this middleware add new category type of an existing category
const addCategoryType = (req, res) => {
  const { category_id, name, min_sales, sales_check_days } = req.body;
  const query =
    "insert into category_types (category_id, name, min_sales, sales_check_days) values (?,?,?,?)";
  db.query(query, [category_id, name, min_sales, sales_check_days], (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't add category type",
      });
    return res.status(201).json({
      success: true,
      message: "Category type added successfully",
    });
  });
};

router.post("/addCategoryType", checkTypeExists, addCategoryType);

module.exports = router;
