const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//This path returns all the clients details from back-end to front-end
router.get("/clients", (req, res) => {
  const query =
    "select  first_name, last_name, city, street, house_num, email, phone_num, status from users where role='client'";
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

//This path is for the employee interface for changing the client's details
router.post("/updateClient", (req, res) => {
  const {
    first_name,
    last_name,
    city,
    street,
    house_num,
    email,
    phone_num,
    status,
  } = req.body;
  const query =
    "update users set first_name=?, last_name=?, city=?, street=?, house_num=?,  phone_num=?, status=? where email=?";
  db.query(
    query,
    [first_name, last_name, city, street, house_num, phone_num, status, email],
    (err, results) => {
      if (err) {
        console.error("Couldn't update user details");
        return res.status(500).json({
          success: false,
          message: "Couldn't update user details ",
          err,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Updating successed",
      });
    },
  );
});

//This path is for chaning the chosen client's status by clicking the "remove" btn
router.post("/changeStatus", (req, res) => {
  const { email, status } = req.body;
  const query = "update users set status=? where email=?";
  db.query(query, [status, email], (err, results) => {
    if (err) {
      console.error("Couldn't change user's status");
      return res.status(500).json({
        success: false,
        message: "Couldn't update user's status",
      });
    }
    return res.status(200).json({
      success: true,
    });
  });
});
module.exports = router;
