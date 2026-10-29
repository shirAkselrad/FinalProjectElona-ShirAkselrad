const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets all the client's reviews
const getReviews = (req, res, next) => {
 const query = "select * from order_reviews order by created_at desc";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error in getReviews:", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't get reviews",
      });
    }

    req.reviews = results;
    next();
  });
};

//this middleware gets all the clients emails
const getReviewEmails = (req, res, next) => {
  if (req.reviews.length === 0) return next();
  const orderIds = req.reviews.map((review) => review.order_id);
  const query =
    "select order_id, client_email from orders where order_id in (?)";
  db.query(query, [orderIds], (err, results) => {
    if (err) {
      console.error("Error in getReviewEmails:", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't get review orders",
      });
    }

    req.reviews = req.reviews.map((review) => {
      const order = results.find((order) => order.order_id === review.order_id);
      return {
        ...review,
        client_email: order?.client_email ?? null,
      };
    });
    next();
  });
};

//this middleware gets all the clients names
const getReviewClients = (req, res, next) => {
  const emails = req.reviews
    .map((review) => review.client_email)
    .filter(Boolean);
  if (emails.length === 0) return next();

  const query =
    "select email, first_name, last_name from users where email in (?)";
  db.query(query, [emails], (err, results) => {
    if (err) {
      console.error("Error in getReviewClients:", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't get review clients",
      });
    }

    req.reviews = req.reviews.map((review) => {
      const client = results.find(
        (client) => client.email === review.client_email,
      );
      return {
        ...review,
        first_name: client?.first_name ?? null,
        last_name: client?.last_name ?? null,
      };
    });
    next();
  });
};

//get all customer reviews
router.get(
  "/reviews",
  getReviews,
  getReviewEmails,
  getReviewClients,
  (req, res) => {
    return res.status(200).json({
      success: true,
      reviews: req.reviews,
    });
  },
);

module.exports = router;
