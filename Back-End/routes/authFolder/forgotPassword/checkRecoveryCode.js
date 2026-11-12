const express = require("express");
const router = express.Router();

//checks if the recovery code is correct and still valid
const checkCode = (req, res, next) => {
  const { code } = req.body || {};
  const codeToCompare = req.session.recoveryCode;

  if (!req.session.email || !req.session.recoveryCodeExpires)
    return res.status(400).json({
      success: false,
      message: "There is no active recovery process",
    });

  //checks if the code has expired
  if (Date.now() >= req.session.recoveryCodeExpires) {
    delete req.session.recoveryCode;

    return res.status(400).json({
      success: false,
      message: "Recovery code expired. Please request a new code.",
    });
  }

  if (!Array.isArray(codeToCompare))
    return res.status(400).json({
      success: false,
      message: "There is no active recovery code",
    });

  //validates and compares the entered code
  const correctCode =
    typeof code === "string" &&
    /^\d{6}$/.test(code) &&
    codeToCompare.length === 6 &&
    codeToCompare.every((digit, index) => digit === Number(code[index]));

  if (!correctCode)
    return res.status(400).json({
      success: false,
      message: "Incorrect recovery code, please try again.",
    });

  next();
};

//returns the expiration timer for the FE timer
router.get("/status", (req, res) => {
  if (!req.session.email || !req.session.recoveryCodeExpires)
    return res.status(404).json({
      success: false,
      message: "there is no actie recovery process",
    });
  return res.status(200).json({
    success: true,
    expiresAt: req.session.recoveryCodeExpires,
  });
});

router.post("/", checkCode, (req, res) => {
  if(!req.session.recoveryVerified)
  {
    req.session.recoveryVerified=true;
    req.session.resetPasswordExpires=Date.now()+5*60*1000; 
  }

  return res.status(200).json({
    success: true,
    message: "Correct code, continue for generating a new password",
  });
});

module.exports = router;
