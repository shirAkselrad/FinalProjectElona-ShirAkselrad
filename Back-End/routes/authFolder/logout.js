const express = require("express");
const router = express.Router();

//This path is for the logout btn in front-end
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({
        success: false,
      });
    return res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;
