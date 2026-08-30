const express = require("express");
const router = express.Router();
const { transporter } = require("../services/mailer");
const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//This path is for the logout btn in front-end
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({
        sucess: false,
      });
    return res.status(200).json({
      success: true,
    });
  });
});
module.exports = router;
