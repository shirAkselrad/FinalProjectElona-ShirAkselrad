const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { sendMailNewPassword } = require("./passwordResetEmail");

const encryptPasswordUpdating = (req, res, next) => {
  if (!req.session.email) {
    return res.status(400).json({
      success: false,
      message: "Password recovery session not found",
    });
  }
  const { password } = req.body;
  const query = "update users set password=? where email=?";
  bcrypt.genSalt(10, (err, salt) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Encrypting error",
      });

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Encrypting error",
        });

      db.query(query, [hashedPassword, req.session.email], (err, results) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: "Error replacing password",
          });
        next();
      });
    });
  });
};

router.post("/", encryptPasswordUpdating, sendMailNewPassword, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Password was updated successfully!",
  });
});

module.exports = router;
