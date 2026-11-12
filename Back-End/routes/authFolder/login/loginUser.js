const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//handles failed login attempts
const failedLogin = (req, res) => {
  req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
  if (req.session.loginAttempts >= 5) {
    req.session.lockUntil = Date.now() + 10 * 60 * 1000;
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again in 10 minutes.",
      lockUntil: req.session.lockUntil,
    });
  }
  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
};

//checks incoming data and temporary login lock
const checkLoginLock = (req, res, next) => {
  const { userName, password } = req.body || {};
  if (
    typeof userName !== "string" ||
    typeof password !== "string" ||
    !userName.trim() ||
    !password
  )
    return res.status(400).json({
      success: false,
      message: "Invalid login details",
    });
  if (req.session.lockUntil) {
    if (Date.now() < req.session.lockUntil)
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again in 10 minutes",
        lockUntil: req.session.lockUntil,
      });
    req.session.loginAttempts = 0;
    req.session.lockUntil = null;
  }
  next();
};

//check user username and password
const checkUserCredentials = (req, res, next) => {
  const query = `select username, password,first_name,email,role,status from users where username=?`;
  db.query(query, [req.body.userName], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't complete login",
      });
    if (results.length === 0) return failedLogin(req, res);
    const user = results[0];
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't complete login",
        });
      if (!isMatch) return failedLogin(req, res);
      if (user.status === "Not Active")
        return res.status(403).json({
          success: false,
          message: "This account is not active. Please contact ELONA.",
        });
      req.loginUser = user;
      next();
    });
  });
};

//creates the session after successfully login
const createLoginSession = (req, res) => {
  const user = req.loginUser;
  req.session.loginAttempts = 0;
  req.session.lockUntil = null;
  req.session.user = {
    userName: user.username,
    firstName: user.first_name,
    email: user.email,
    role: user.role,
  };
  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: req.session.user,
  });
};

router.post("/", checkLoginLock, checkUserCredentials, createLoginSession);
module.exports = router;
