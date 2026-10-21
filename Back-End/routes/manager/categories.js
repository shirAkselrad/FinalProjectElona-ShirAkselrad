const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

const checkCategoryExists = (req, res, next) => {
  const { name } = req.body;
  const query = "select category_id from categories where name=?";

  db.query(query, [name], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check category",
      });

    if (results.length > 0)
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });

    next();
  });
};

const startTransaction = (req, res, next) => {
  db.beginTransaction((err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't start transaction",
      });

    next();
  });
};

const addCategory = (req, res, next) => {
  const { name } = req.body;
  const query = "insert into categories (name) values(?)";

  db.query(query, [name], (err, results) => {
    if (err)
      return db.rollback(() => {
        res.status(500).json({
          success: false,
          message: "Couldn't add category",
        });
      });

    req.categoryId = results.insertId;
    next();
  });
};

const addCategoryTypes = (req, res, next) => {
  const { types } = req.body;

  const values = types.map((type) => [
    req.categoryId,
    type.name,
    type.min_sales,
    type.sales_check_days,
  ]);

  const query =
    "insert into category_types (category_id, name, min_sales, sales_check_days) values ?";

  db.query(query, [values], (err) => {
    if (err)
      return db.rollback(() => {
        res.status(500).json({
          success: false,
          message: "Couldn't add category's types",
        });
      });

    next();
  });
};

router.post(
  "/addCategory",
  checkCategoryExists,
  startTransaction,
  addCategory,
  addCategoryTypes,
  (req, res) => {
    db.commit((err) => {
      if (err)
        return db.rollback(() => {
          res.status(500).json({
            success: false,
            message: "Couldn't save category",
          });
        });

      return res.status(201).json({
        success: true,
        message: "Category and its types added successfully",
      });
    });
  },
);

module.exports = router;
