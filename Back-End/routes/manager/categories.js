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
router.post("/addCategory", checkCategoryExists, (req, res) => {
  const { name, types } = req.body;
  //converting the types array into a string
  const typesString = types.join(",");
  const query = "insert into categories (name, types) values (?,?)";
  db.query(query, [name, typesString], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't add category",
      });
    return res.status(201).json({
      success: true,
      message: "Category added successfully",
    });
  });
});

module.exports = router;
