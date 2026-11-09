const express = require("express");
const router = express.Router();

const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

const { checkUserLoggedIn } = require("./getUserDetails");

//this middleware updates the logged in user details
const updateUserDetails = (req, res, next) => {
  const { first_name, last_name, city, street, house_num, phone_num } =
    req.body;
  const query =
    "update users set first_name=? , last_name=?, city=?, street=?, house_num=?, phone_num=? where email=?";
  db.query(
    query,
    [
      first_name,
      last_name,
      city,
      street,
      house_num,
      phone_num,
      req.session.user.email,
    ],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update user's details",
        });
      if (results.affectedRows === 0)
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      next();
    },
  );
};

router.put("/me", checkUserLoggedIn, updateUserDetails, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
  });
});

module.exports = router;
