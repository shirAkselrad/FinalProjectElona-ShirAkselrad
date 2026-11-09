const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//change user status
router.post("/changeUserStatus", (req, res) => {
  const { email, status } = req.body;
  const query =
    "update users set status=? where email=? and role in('Client', 'Employee')";
  db.query(query, [status, email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update user status",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
    });
  });
});

module.exports = router;
