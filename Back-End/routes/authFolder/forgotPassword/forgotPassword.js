const express = require("express");
const router = express.Router();
const { randomInt } = require("crypto");

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { sendRecoveryCode } = require("./recoveryEmail");

//This middleware checks if the email exists in the DB
const checkEmail = (req, res, next) => {
  const { email } = req.body || {};

  //if email is not string/empty
  if (typeof email !== "string" || !email.trim())
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });

  const query = "select first_name, last_name from users where email=?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }

    if (results.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Email is not found",
      });
    }
    req.user = results[0]; //saving first_name and last_name
    req.recoveryEmail = email.trim(); //saving the email address for the recovery code
    next();
  });
};

//This middleware generates a secure six digits recovery code
const recoveryCodeGenerate = (req, res, next) => {
  //creating the recovery code (length=6, numbers between 0 to 9)
  req.recoveryCode = Array.from({ length: 6 }, () => randomInt(0, 10));
  next();
};

//this middleware sends the recovery code and saves it in the session
const sendCode = async (req, res) => {
  try {
    const fullName = req.user.first_name + " " + req.user.last_name;

    //sending the recovery code to the user email with the full name and the recovery code
    await sendRecoveryCode(req.recoveryEmail, fullName, req.recoveryCode);

    req.session.recoveryCode = req.recoveryCode; //saving the recovery code
    req.session.recoveryCodeExpires = Date.now() + 5 * 60 * 1000; //saving the time the recovery code is still relevate

    req.session.recoveryVerified = false; //saving rather the code has been already matched
    req.session.email = req.recoveryEmail; //saving the user email
    delete req.session.resetPasswordExpires; //deleting the line which gives an option to the user for resting the password

    return res.status(200).json({
      success: true,
      message: "A recovery code was sent to your email",
      expiresAt: req.session.recoveryCodeExpires,
    });
  } catch (error) {
    console.error("Error sending recovery code:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send a recovery code to your email",
    });
  }
};

//check if a new code can be requested
const checkResendPermission = (req, res, next) => {
  //if there is no email or the recovery code hasn't exipred yet then the user cannot get a new recovery code
  if (!req.session.email || !req.session.recoveryCodeExpires)
    return res.status(400).json({
      success: false,
      message: "There is no active recovery process",
    });

  //if the expiry code time didn't end yet, the user cannot get a new recovery code
  if (Date.now() < req.session.recoveryCodeExpires)
    return res.status(429).json({
      success: false,
      message: "Please wait until the code expires",
      expiresAt: req.session.recoveryCodeExpires,
    });

  //saving all the parameters
  req.body = {
    ...req.body,
    email: req.session.email,
  };

  next();
};

//This path is for the forgot password part, checking if the email that was entered exists.
router.post(
  "/",
  checkEmail,
  recoveryCodeGenerate,
  (req, res, next) => {
    //invalidates any previous recovery approval
    req.session.recoveryVerified = false;//yet haven't verified
    delete req.session.recoveryCode;
    delete req.session.recoveryCodeExpires;
    delete req.session.email;
    delete req.session.resetPasswordExpires;
    next();
  },
  sendCode,
);

//resends the recovery code after five mins
router.post(
  "/resend",
  checkResendPermission,
  checkEmail,
  recoveryCodeGenerate,
  sendCode,
);

module.exports = router;
