const path = require("path");
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//This path gets the logged-in user info from the session
router.get("/user", (req, res) => {
  console.log("SESSION:", req.session);
  if (!req.session.user) {
    return res.status(200).json({ success: false, user: null });
  }

  return res.json({
    success: true,
    user: req.session.user,
  });
});

function failedLogin(req, res) {
  req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
  if (req.session.loginAttempts >= 5) {
    req.session.lockUntil = Date.now() + 10 * 60 * 1000;
    return res.status(429).json({
      success: false,
      message: "Too many login attempts.Please try again in 10 minutes.",
      lockUntil:req.session.lockUntil
    });
  }
  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
}

//This path is for the login part, the user fill the username and password,
//if those are valid and correct will be able to start shopping,
//else will have to try again
router.post("/", (req, res) => {
  const { userName, password } = req.body;
  //checking if the user is blocked after unsuccessed loggin
  if (req.session.lockUntil) {
    if (Date.now() < req.session.lockUntil)
      return res.status(429).json({
        success: false,
        message: "Too many login attempts.Please try again in 10 minutes.",
        lockUntil: req.session.lockUntil,
      });
    req.session.loginAttempts = 0;
    req.session.lockUntil = null;
  }
  const query =
    "select username, password, first_name,email, role, status from users where username=?";

  db.query(query, [userName], (err, results) => {
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
          req.session.loginAttempts = 0;
          req.session.lockUntil = null;
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
            email: results[0].email,
            role: results[0].role,
          };

          return res.status(200).json({
            success: true,
            message: "Login successful",
            user: req.session.user,
          });
        }

        return failedLogin(req, res);
      });
    }

    return failedLogin(req, res);
  });
});

module.exports = router;
