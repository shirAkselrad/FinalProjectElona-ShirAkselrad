const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { sendRegisterationMail } = require("./registrationEmail");

//This path is for the registeration, the user fill all the inputs and if all the details are valid and the user doesn't exists- a new user will be added to the users table in the store db
console.log("register route loaded");
router.post("/", (req, res) => {
  console.log("POST /register reached");
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
  } = req.body;
  console.log(firstName, lastName);
  const query =
    "insert into users (first_name, last_name, city,street, house_num,email, phone_num, username, password,role, status, points) values(?,?,?,?,?,?,?,?,?,?,?,?)";

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
          city,
          street,
          houseNum,
          email,
          phoneNum,
          userName,
          hashedPassword,
          "Client",
          "Active",
          0,
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
