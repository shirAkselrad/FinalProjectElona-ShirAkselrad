const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

router.get("/getProductImages/:product_id", (req, res) => {
  const { product_id } = req.params;
  const query = "select * from files where product_id=?";
  db.query(query, [product_id], (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Couldn't get the files",
      });
    } else {
      if (results.length == 0) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Product's files found successfully",
          files: results,
        });
      }
    }
  });
});

module.exports = router;
