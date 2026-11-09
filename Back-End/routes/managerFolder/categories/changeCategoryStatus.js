const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");

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

router.put(
  "/changeCategoryStatus",
  startTransaction,
  changeCategoryStatus,
  changeAllCategoryTypesStatus,
  commitTransaction,
);

module.exports = router;
