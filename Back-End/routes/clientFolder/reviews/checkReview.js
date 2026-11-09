const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const checkReviewStatus = (req, res) => {
  const { order_id } = req.params;
  const query = "select review_id from order_reviews where order_id=?";

  db.query(query, [order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Data base error",
      });

    return res.status(200).json({
      success: true,
      alreadyReviewed: results.length > 0,
    });
  });
};

router.get("/:order_id", checkReviewStatus);

module.exports = router;
