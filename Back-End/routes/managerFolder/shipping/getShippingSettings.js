const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middlewares gets all the shipping settings
const getShippingSettings = (req, res) => {
  db.query("select * from shipping_settings", (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get shipping settings",
      });
    return res.status(200).json({
      success: true,
      settings: results[0],
    });
  });
};

router.get("/shippingSettings", getShippingSettings);

module.exports = router;
