const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { sendRecoveryCode } = require("./recoveryEmail");

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
