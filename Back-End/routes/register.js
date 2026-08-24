const path = require("path");
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();
const { transporter } = require("../services/mailer");

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

async function sendRegisterationMail(email, fullName) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to ELONA",
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
        WELCOME TO ELONA
      </h1>

      <p style="
        color: #51453e;
        font-size: 16px;
      ">
        Hello ${fullName},
      </p>

      <p style="
        color: #51453e;
        font-size: 15px;
      ">
        Your account has been created successfully.
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

    </div>`,
  });
}

//This path is for the registeration, the user fill all the inputs and if all the details are valid and the user doesn't exists- a new user will be added to the users table in the store db
console.log("register route loaded");
router.post("/", (req, res) => {
  console.log("POST /register reached");
  const {
    firstName,
    lastName,
    ID,
    city,
    street,
    houseNum,
    email,
    phoneNum,
    userName,
    password,
  } = req.body;
  console.log(firstName, lastName);
  const query =
    "insert into users (first_name, last_name,user_id, city,street, house_num,email, phone_num, username, password,role, status) values(?,?,?,?,?,?,?,?,?,?,?,?)";

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;

    //Hahing password with salt
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) throw err;
      //save hashpassword to database
      db.query(
        query,
        [
          firstName,
          lastName,
          ID,
          city,
          street,
          houseNum,
          email,
          phoneNum,
          userName,
          hashedPassword,
          "Client",
          "Active",
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error creating user",
            });
          }
          sendRegisterationMail(email, firstName + " " + lastName)
            .then(() => {
              console.log("Registration email sent successfully");
            })
            .catch((err) => {
              console.error("Error sending registration email:", err);
            });
          return res.status(201).json({
            success: true,
            message: "user added!",
            id: results.insertId,
          });
        },
      );
    });
  });
});

module.exports = router;
