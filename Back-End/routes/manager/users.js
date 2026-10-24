const path = require("path");
const express = require("express");

const router = express.Router();

const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

router.get("/users", (req, res) => {
  const query =
    "select first_name, last_name, city,street,house_num,email, phone_num, status, points, role from users where role in('Client', 'Employee')";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get users",
      });
    return res.status(200).json({
      success: true,
      users: results,
    });
  });
});

//update user details and role
router.post("/updateUser", (req, res) => {
  const {
    email,
    first_name,
    last_name,
    phone_num,
    city,
    street,
    house_num,
    role,
  } = req.body;
  const allowedRoles = ["Client", "Employee", "Manager"];
  if (!allowedRoles.includes(role))
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  const query =
    "update users set first_name=?, last_name=?, phone_num=?, city=?,street=?,house_num=?,role=? where email=? and role in('Client', 'Employee')";
  const values = [
    first_name,
    last_name,
    phone_num,
    city,
    street,
    house_num,
    role,
    email,
  ];
  db.query(query, values, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update user",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  });
});

//get all the cities without duplicates
router.get("/citiesNoRepeat", (rfeq, res) => {
  const query =
    "select distinct city from users where role in('Client','Employee') order by city";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get cities",
      });
    return res.status(200).json({
      success: true,
      cities: results.map((row) => row.city),
    });
  });
});

//change user status
router.post("/changeUserStatus", (req, res) => {
  const { email, status } = req.body;
  const query =
    "update users set status=? where email=? and role in('Client', 'Employee')";
  db.query(query, [status, email], (err, results) => {
    if (err)
      return req.status(500).json({
        success: false,
        message: "Couldn't update user status",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
    });
  });
});
module.exports = router;
