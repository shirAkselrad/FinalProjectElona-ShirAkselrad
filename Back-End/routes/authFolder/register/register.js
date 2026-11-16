const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { sendRegisterationMail } = require("./registrationEmail");

//check required registration details
const checkDetails = (req, res, next) => {
  const {
    firstName,
    lastName,
    city,
    street,
    houseNum,
    email,
    phoneNum,
    userName,
    password,
  } = req.body || {};

  const fields = [
    firstName,
    lastName,
    city,
    street,
    houseNum,
    email,
    phoneNum,
    userName,
    password,
  ];

  if (fields.some((value) => value == null || String(value).trim() === ""))
    return res.status(400).json({
      success: false,
      message: "Invalid registration details",
    });

  if (
    typeof email !== "string" ||
    typeof userName !== "string" ||
    typeof password !== "string"
  )
    return res.status(400).json({
      success: false,
      message: "Invalid registration details",
    });

  next();
};

//check if email or username already exists
const checkExistingUser = (req, res, next) => {
  const { email, userName } = req.body;

  const query = "select email, username from users where email=? or username=?";

  db.query(query, [email, userName], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check existing users",
      });

    if (results.length > 0)
      return res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });

    next();
  });
};

//hash password
const hashPassword = async (req, res, next) => {
  try {
    req.hashedPassword = await bcrypt.hash(req.body.password, 10);
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't hash password",
    });
  }
};

//create a new client
const createUser = (req, res) => {
  const {
    firstName,
    lastName,
    city,
    street,
    houseNum,
    email,
    phoneNum,
    userName,
  } = req.body;

  const query = `
    insert into users
    (first_name, last_name, city, street, house_num,
     email, phone_num, username, password, role, status, points)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    firstName,
    lastName,
    city,
    street,
    houseNum,
    email,
    phoneNum,
    userName,
    req.hashedPassword,
    "Client",
    "Active",
    0,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error creating user",
      });
    }

    //send registration email
    sendRegisterationMail(email, firstName + " " + lastName)
      .then(() => {
        console.log("Registration email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending registration email:", error);
      });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      id: results.insertId,
    });
  });
};

//registration route
router.post("/", checkDetails, checkExistingUser, hashPassword, createUser);

module.exports = router;
