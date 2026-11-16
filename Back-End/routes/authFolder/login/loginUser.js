const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//handles failed login attempts
const failedLogin = (req, res) => {
  //checking user attemps
  req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
  //if the users failed to login for 5 times
  if (req.session.loginAttempts >= 5) {
    req.session.lockUntil = Date.now() + 10 * 60 * 1000; //being blocked for 10 mins
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again in 10 minutes.",
      lockUntil: req.session.lockUntil, //saving the block time
    });
  }
  //if have't reached the 5 fails attempts
  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
};

//checks incoming data and temporary login lock
const checkLoginLock = (req, res, next) => {
  const { userName, password } = req.body || {};

  //checking username and password values
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
  //if the time of the lock time haven't expired yet then the user cannot login
  if (req.session.lockUntil) {
    if (Date.now() < req.session.lockUntil)
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again in 10 minutes",
        lockUntil: req.session.lockUntil,
      });
    //if the block time expired, the login attemps rest and the lock time becomes null
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
    //user not found
    if (results.length === 0) return failedLogin(req, res);

    const user = results[0];
    //compering between the password which have been given by the user and the saved one
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't complete login",
        });
        //not matched 
      if (!isMatch) return failedLogin(req, res);
      //the user status is not active then cannot login to the website 
      if (user.status === "Not Active")
        return res.status(403).json({
          success: false,
          message: "This account is not active. Please contact ELONA.",
        });
      //successfull login, saving user details 
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
