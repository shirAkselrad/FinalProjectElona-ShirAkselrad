const express = require("express");
const router = express.Router();

const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware checks if a user is logged in
const checkUserLoggedIn = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({
      success: false,
      message: "Please log in",
    });
  next();
};

//this middleware gets the logged in user details
const getUserDetails = (req, res, next) => {
  const query =
    "select first_name, last_name, city, street, house_num, phone_num, email from users where email=?";
  db.query(query, [req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get user deatils",
      });
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    req.userDetails = results[0];
    next();
  });
};

router.get("/me", checkUserLoggedIn, getUserDetails, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.userDetails,
  });
});

module.exports = {
  router,
  checkUserLoggedIn,
};
