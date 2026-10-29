const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets the points settings
const getPointsSettings = (req, res) => {
  db.query("select * from points_settings", (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get points settings",
      });

    return res.status(200).json({
      success: true,
      settings: results[0],
    });
  });
};

const updatePointsSettings = (req, res, next) => {
  const { min_order_price, earning_percentage } = req.body;
  const query =
    "update points_settings set min_order_price=?, earning_percentage=?";
  db.query(query, [min_order_price, earning_percentage], (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update points settings",
      });
    next();
  });
};

router.get("/pointsSettings", getPointsSettings);
router.put("/updatePointsSettings", updatePointsSettings, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Points settings have been updated successfully",
  });
});
module.exports = router;
