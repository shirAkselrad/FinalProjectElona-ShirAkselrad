const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
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

    req.reviews = results; //saving review info (review_id, order_id, rating,comment, created_at)
    next();
  });
};

//this middleware gets all the clients emails
const getReviewEmails = (req, res, next) => {
  if (req.reviews.length === 0) return next();
  //getting all the orders ids from the reviews
  const orderIds = req.reviews.map((review) => review.order_id);
  //getting user email fitted with order_id
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

    //fits each review to an email
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
  //getting all the emails from the reviews
  const emails = req.reviews
    .map((review) => review.client_email)
    .filter(Boolean);
  if (emails.length === 0) return next();
  //getting the first and the last name according to the emails
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

    //fits each email to each first and last name of the client
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
  getReviews, //gets the reviews
  getReviewEmails, //gets the emails
  getReviewClients, //gets the first and the last name of the client
  (req, res) => {
    return res.status(200).json({
      success: true,
      reviews: req.reviews, //returns the review, email, first_name, last_name of the client
    });
  },
);

module.exports = router;
