const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

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

module.exports = router;
