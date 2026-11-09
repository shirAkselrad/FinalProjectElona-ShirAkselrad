const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
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

//get all the cities without duplicates
router.get("/citiesNoRepeat", (req, res) => {
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

module.exports = router;
