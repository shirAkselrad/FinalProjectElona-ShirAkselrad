const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This path returns all the clients details from back-end to front-end
router.get("/clients", (req, res) => {
  const { status, city, search } = req.query;
  let query = `select first_name, last_name, city, street,house_num,email,phone_num, status,points from users where role=?`;
  const params = ["Client"];
  if (status && status !== "All Statuses") {
    query += " and status=?";
    params.push(status);
  }

  if (city && city !== "All Cities") {
    query += " and city=?";
    params.push(city);
  }
  if (search?.trim()) {
    const searchValue = `%${search.trim()}%`;
    query += ` and( first_name like ? or last_name like ? or city like ? or street like ? or email like ? or phone_num like ?)`;
    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
    );
  }

  db.query(query, params, (err, results) => {
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
    "select distinct city from users where role='Client' order by city";
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
