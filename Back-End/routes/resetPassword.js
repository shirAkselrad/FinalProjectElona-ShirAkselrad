const path = require("path");
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();
const { transporter } = require("../services/mailer");

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//This middle ware is for sending the user a mail after updating the password
const sendMailNewPassword = async (req, res, next) => {
  const email = req.session.email;
  const query = "select first_name, last_name from users where email=?";
  db.query(query, [email], async (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    if (results.length == 0)
      return res.status(404).json({
        success: false,
        message: "No user match to the given email",
      });
    const fullname = results[0].first_name + " " + results[0].last_name;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset - ELONA",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            background-color: #fbf8f5;
            padding: 40px;
            text-align: center;
          ">
            <h1 style="
              color: #3f332d;
              font-size: 28px;
              letter-spacing: 2px;
            ">
              PASSWORD UPDATED
            </h1>

            <p style="
              color: #51453e;
              font-size: 16px;
            ">
              Hello ${fullname},
            </p>

            <p style="
              color: #51453e;
              font-size: 15px;
            ">
              Your password was reset successfully.
            </p>

            <div style="
              margin: 30px 0;
              color: #c49a5a;
            ">
              ◆
            </div>

            <p style="
              color: #3f332d;
              font-size: 14px;
            ">
              Exclusive fashion for strong women
            </p>
          </div>
        `,
      });
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message:
          "Passpord updated but there was an error with sending the email ",
      });
    }
  });
};

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
