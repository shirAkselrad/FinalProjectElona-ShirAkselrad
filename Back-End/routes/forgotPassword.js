const express = require("express");
const router = express.Router();
const { transporter } = require("../services/mailer");
const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//middle ware

//This middleware checks if the given email input value from the user exists in the db
const checkEmail = (req, res, next) => {
  const { email } = req.body;
  const query = "select * from users where email=?";
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
    req.user = results[0];
    next();
  });
};

//This middleware generates a random recovery code which will be sent to the user
const recoveryCodeGenerate = (req, res, next) => {
  let code = [];
  for (let i = 0; i < 6; i++) code[i] = Math.floor(Math.random() * 10);
  req.recoveryCode = code;
  next();
};

//This function gets an email address and a full name and a recovery code and send it to the user for changing the password
async function sendRecoveryCode(email, fullName, code) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recovery Code - ELONA ",
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
        Recovery Code
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
        This is your recovery code:
      </p>
      <p>${code.join(" ")}</p>

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

//This path is for the forgot password part, checking if the email that was entered exists.
router.post("/", checkEmail, recoveryCodeGenerate, async (req, res) => {
  try {
    const fullName = req.user.first_name + " " + req.user.last_name;
    await sendRecoveryCode(req.body.email, fullName, req.recoveryCode);

    req.session.recoveryCode = req.recoveryCode;
    req.session.email = req.body.email;

    return res.status(200).json({
      success: true,
      message: "A recovery code was sent to your mail",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send a recovery code to the mail",
    });
  }
});

module.exports = router;
