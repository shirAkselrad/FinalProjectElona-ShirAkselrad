const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { sendMailNewPassword } = require("./passwordResetEmail");

//checks id the recovery code was verified
const checkResetPermission = (req, res, next) => {
  if (
    !req.session.email ||
    req.session.recoveryVerified !== true ||
    !req.session.resetPasswordExpires ||
    Date.now() >= req.session.resetPasswordExpires
  )
    return res.status(403).json({
      success: false,
      message: "Password recovery verification required or expired",
    });

  next();
};

const encryptPasswordUpdating = (req, res, next) => {
  const { password } = req.body||{};
  if (typeof password !== "string" || !password)
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Encrypting error",
      });
    const query = "update users set password=? where email=?";
    db.query(query, [hashedPassword, req.session.email], (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Error replacing password",
        });
      if (results.affectedRows !== 1)
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      //prevents reuse of the recovery verification
      req.session.recoveryVerified = false;
      delete req.session.recoveryCode;
      delete req.session.recoveryCodeExpires;
      delete req.session.resetPasswordExpires;
      next();
    });
  });
};

router.post(
  "/",
  checkResetPermission,
  encryptPasswordUpdating,
  sendMailNewPassword,
  (req, res) => {
    delete req.session.email;
    return res.status(200).json({
      success: true,
      message: "Password was updated successfully!",
    });
  },
);

module.exports = router;
