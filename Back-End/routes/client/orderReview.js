const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
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




const checkOrderStatus = (req, res, next) => {
  const { order_id } = req.body;
  console.log("Received order_id:", order_id);
  const query = "select status from orders where order_id=?";
  db.query(query, [order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Data base error",
      });
    console.log("Order results:", results);
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    if (results[0].status !== "COMPLETED")
      return res.status(400).json({
        success: false,
        message: "Only completed orders can be reviewed",
      });
    next();
  });
};

const checkExistingReview = (req, res, next) => {
  const { order_id } = req.body;
  const query = "select review_id from order_reviews where order_id=?";
  db.query(query, [order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Data base error",
      });
    if (results.length > 0)
      return res.status(409).json({
        success: false,
        message: "A review already exists for this order",
      });
    next();
  });
};

const saveReview = (req, res) => {
  const { order_id, rating, comment } = req.body;
  const query =
    "insert into order_reviews (order_id, rating, comment) values(?,?,?)";
  db.query(query, [order_id, rating, comment], (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Data base error",
      });
    return res.status(201).json({
      success: true,
      message: "Thank you for your review!",
    });
  });
};

router.post("/", checkOrderStatus, checkExistingReview, saveReview);
module.exports = router;
