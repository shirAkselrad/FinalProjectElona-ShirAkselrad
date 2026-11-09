const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This path is for chaning the chosen client's status by clicking the "remove" btn
router.post("/changeClientStatus", (req, res) => {
  const { email, status } = req.body;
  const query = "update users set status=? where email=?";
  db.query(query, [status, email], (err, results) => {
    if (err) {
      console.error("Couldn't change user's status");
      return res.status(500).json({
        success: false,
        message: "Couldn't update user's status",
      });
    }
    return res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;
