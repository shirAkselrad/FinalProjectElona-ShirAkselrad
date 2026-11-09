const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This path returns all the clients details from back-end to front-end
router.get("/clients", (req, res) => {
  const query =
    "select  first_name, last_name, city, street, house_num, email, phone_num, status, points from users where role='client'";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Could not get clients, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Could not get clients",
      });
    }
    return res.status(200).json({
      success: true,
      clients: results,
    });
  });
});

//This path returns the whole cities without repeats
router.get("/citiesNoRepeat", (req, res) => {
  const query =
    "select distinct city from users where role='client' order by city";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Couldn't get cities, the errror is: ", err);
      return res.status(500).json({
        success: false,
        message: "Failed getting cities from data base",
      });
    }
    const cities = results.map((c) => c.city);
    return res.status(200).json({
      success: true,
      cities: cities,
    });
  });
});

module.exports = router;
