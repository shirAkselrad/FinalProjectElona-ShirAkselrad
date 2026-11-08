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

const startTransaction = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get database connection",
      });
    req.db = connection;
    req.db.beginTransaction((err) => {
      if (err) {
        req.db.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't start transaction",
        });
      }
      next();
    });
  });
};

const commitTransaction = (req, res) => {
  req.db.commit((err) => {
    if (err)
      return req.db.rollback(() => {
        req.db.release();
        res.status(500).json({
          success: false,
          message: "Couldn't save category status",
        });
      });
    req.db.release();
    return res.status(200).json({
      success: true,
      message: "Category and its types status updated successfully",
    });
  });
};
//this middleware changes category status
const changeCategoryStatus = (req, res, next) => {
  const { category_id, status } = req.body;
  if (!["Active", "Not Active"].includes(status))
    return req.db.rollback(() => {
      req.db.release();
      res.status(400).json({ success: false, message: "Invalid status" });
    });
  const query = "update categories set status=? where category_id=?";
  req.db.query(query, [status, category_id], (err, results) => {
    if (err)
      return req.db.rollback(() => {
        req.db.release();
        res.status(500).json({
          success: false,
          message: "Couldn't update category status",
        });
      });

    if (results.affectedRows === 0)
      return req.db.rollback(() => {
        req.db.release();
        res.status(404).json({
          success: false,
          message: "Category not found",
        });
      });

    next();
  });
};

const changeAllCategoryTypesStatus = (req, res, next) => {
  const { category_id, status } = req.body;
  const query = "update category_types set status=? where category_id=?";
  req.db.query(query, [status, category_id], (err) => {
    if (err)
      return req.db.rollback(() => {
        req.db.release();
        res.status(500).json({
          success: false,
          message: "Couldn't update category types status",
        });
      });
    next();
  });
};

//this middleware changes category type status
const changeCategoryTypeStatus = (req, res) => {
  const { type_id, status } = req.body;
  if (!["Active", "Not Active"].includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });
  const query = "update category_types set status=? where type_id=?";
  db.query(query, [status, type_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update category type status",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "Category type not found",
      });
    return res.status(200).json({
      success: true,
      message: "Category type status updated successfully",
    });
  });
};
router.post("/addCategoryType", checkTypeExists, addCategoryType);
router.put(
  "/changeCategoryStatus",
  startTransaction,
  changeCategoryStatus,
  changeAllCategoryTypesStatus,
  commitTransaction,
);
router.put("/changeCategoryTypeStatus", changeCategoryTypeStatus);
module.exports = router;
