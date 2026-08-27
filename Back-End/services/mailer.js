//This file responsible for the mail sending
const nodemailer = require("nodemailer");

//transport contain all the details for sending the mail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  //these user and passoword are those of the sender (ELONA SHOP)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//This part verfication the mail sending result (just for checking)
transporter.verify((error, success) => {
  if (error) {
    console.log("Mailer error:", error);
  } else {
    console.log("Mailer is ready");
  }
});

module.exports = { transporter };
