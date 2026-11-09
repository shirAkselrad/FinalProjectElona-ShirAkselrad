const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware returns the details of the active promotion
const getActivePromotion = (req, res) => {
  const query = `select name, discount_percentage, min_order_price, end_date from promotions_settings where status="Active" and start_date<=now() and end_date>now() limit 1`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get active promotion",
      });
    return res.status(200).json({
      success: true,
      promotion: results[0] || null,
    });
  });
};

//this path returns the current active promotion
router.get("/getActivePromotion", getActivePromotion);

module.exports = router;
