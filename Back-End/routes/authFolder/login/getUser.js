const express = require("express");
const router = express.Router();

//This path gets the logged-in user info from the session
router.get("/user", (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ success: false, user: null });
  }

  return res.json({
    success: true,
    user: req.session.user,
  });
});

module.exports = router;
