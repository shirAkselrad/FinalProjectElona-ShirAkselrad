const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
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

router.get("/pointsSettings", getPointsSettings);

module.exports = router;
