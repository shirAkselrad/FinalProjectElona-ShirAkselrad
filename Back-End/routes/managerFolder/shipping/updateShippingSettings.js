const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const updateShippingSettings = (req, res, next) => {
  const { shipping_price, min_delivery_days, max_delivery_days } = req.body;
  const query = `update shipping_settings set shipping_price=?, min_delivery_days=?, max_delivery_days=?`;
  db.query(
    query,
    [shipping_price, min_delivery_days, max_delivery_days],
    (err) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update shipping settings",
        });
      next();
    },
  );
};

router.put("/updateShippingSettings", updateShippingSettings, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Shipping settings have been updated successfully",
  });
});

module.exports = router;
