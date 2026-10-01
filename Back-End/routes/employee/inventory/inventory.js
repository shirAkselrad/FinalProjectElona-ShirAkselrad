const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

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
