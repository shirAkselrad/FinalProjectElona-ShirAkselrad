const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

router.get("/clients", (req, res) => {
  const query =
    "select user_id, first_name, last_name, city, street, house_num, email, phone_num, status from users where role='client'";
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
    user_id,
  } = req.body;
  const query =
    "update users set first_name=?, last_name=?, city=?, street=?, house_num=?, email=?, phone_num=?, status=? where user_id=?";
  db.query(
    query,
    [
      first_name,
      last_name,
      city,
      street,
      house_num,
      email,
      phone_num,
      status,
      user_id,
    ],
    (err, results) => {
      if (err) {
        console.error("Couldn't update user details");
        return res.status(500).json({
          success: false,
          message: "Couldn't update user details",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Updating successed",
      });
    },
  );
});
module.exports = router;
