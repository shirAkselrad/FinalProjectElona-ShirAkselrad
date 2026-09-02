const path = require("path");
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//This path is for getting the first name from the sesssion after the login
router.get("/firstName", (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ success: false });
  }

  return res.json({
    success: true,
    firstName: req.session.user.firstName,
  });
});

//This path is for the login part, the user fill the username and password,
//if those are valid and correct will be able to start shopping,
//else will have to try again
router.post("/", (req, res) => {
  const { userName, password } = req.body;
  console.log("body:", req.body);
  const query =
    "select username, password, first_name, role, status from users where username=?";

  db.query(query, [userName], (err, results) => {
    console.log("results:", results);
    if (err) {
      return res.status(500).send(err);
    }

    console.log(results);

    if (results.length != 0) {
      return bcrypt.compare(password, results[0].password, (err, isMatch) => {

        if (err) {
          return res.status(500).send(err);
        }

        if (isMatch) {
          if (results[0].status === "Not Active") {
            return res.status(403).json({
              success: false,
              message:
                "The user is not active anymore, please call ELONA for changing the status",
            });
          }
          req.session.user = {
            userName: userName,
            firstName: results[0].first_name,
            role: results[0].role,
          };

          return res.status(200).json({
            success: true,
            message: "Login successful",
            role: results[0].role,
          });
        }

        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  });
});

module.exports = router;
