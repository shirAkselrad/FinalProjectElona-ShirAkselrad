const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const updatePointsSettings = (req, res, next) => {
  const { min_order_price, earning_percentage, max_redemption_percentage } =
    req.body;
  const query =
    "update points_settings set min_order_price=?, earning_percentage=?, max_redemption_percentage=?";
  db.query(
    query,
    [min_order_price, earning_percentage, max_redemption_percentage],
    (err) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update points settings",
        });
      next();
    },
  );
};

router.put("/updatePointsSettings", updatePointsSettings, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Points settings have been updated successfully",
  });
});

module.exports = router;
