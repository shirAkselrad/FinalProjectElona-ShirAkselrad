const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton");

//This middle ware checks if the given recovery code is equal to the code which was sent to the user's email
const checkCode = (req, res, next) => {
  const  code  = req.body.code; //by string
  const codeToCompare = req.session.recoveryCode; //by array
  if (!codeToCompare)
    return res.status(400).json({
      success: false,
      message: "There is no recovery code",
    });
  for (let i = 0; i < 6; i++)
    if (Number(code[i]) !== codeToCompare[i])
      return res.status(400).json({
        success: false,
        message: "Incorrect recovery code, please try again",
      });
  next();
};

//This path check if the recovery code is correct
router.post("/", checkCode, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Correct code, continue for generating a new password",
  });
});

module.exports = router;
