const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { checkingRole } = require("../cart/middlewares/cartRole");

router.get("/getDetails", (req, res) => {
  if (!req.session?.user?.email)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });

  const email = req.session.user.email;
  const query =
    "select first_name, last_name, phone_num, city, street, house_num from users where email=? and role='Client'";

  db.query(query, [email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get client details",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });

    return res.status(200).json({
      success: true,
      client: results[0],
    });
  });
});

//this middleware gets all the clients details (first and last namae, address and contact addresses)
const getClientDetails = (req, res, next) => {
  const query =
    "select first_name, last_name,city, street, house_num, phone_num, email from users where email=?";
  db.query(query, [req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get client's details",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    req.clientDetails = results[0];
    next();
  });
};

router.get("/getClientDetails", checkingRole, getClientDetails, (req, res) => {
  return res.status(200).json({
    success: true,
    client: req.clientDetails,
  });
});

module.exports = router;
