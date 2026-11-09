const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

router.get("/users", (req, res) => {
  const { status, city, search } = req.query;
  let query = `select first_name, last_name, city, street, house_num,email,phone_num,status,points, role from users where role in('Client', 'Employee')`;
  const params = [];
  if (status && status !== "All Statuses") {
    query += ` and status=?`;
    params.push(status);
  }
  if (city && city !== "All Cities") {
    query += " and city=?";
    params.push(city);
  }
  if (search?.trim()) {
    const searchValue = `%${search.trim()}%`;
    query += ` and(first_name like ? or last_name like ? or city like ? or street like ? or email like ? or phone_num like ? or role like ?)`;
    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
    );
  }
  db.query(query, params, (err, results) => {
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
