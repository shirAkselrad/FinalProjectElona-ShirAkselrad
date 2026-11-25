const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//getting all the customer reviews
const getCustomerReviews = (req, res, next) => {
  const query = `select review_id, rating, comment, created_at from order_reviews order by created_at desc`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get customer reviews",
      });
    req.reviews = results;
    next();
  });
};

//getting all reviews and calculating the avg rating
const calculateReviews = (req, res) => {
  const reviews = req.reviews;
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        totalReviews
      : 0;
  return res.status(200).json({
    success: true,
    reviews,
    totalReviews,
    avgRating: Number(avgRating.toFixed(1)),
  });
};

router.get("/customerReviews", getCustomerReviews, calculateReviews);
module.exports = router;