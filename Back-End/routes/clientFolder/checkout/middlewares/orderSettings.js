const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

const getShippingSettings = (req, res, next) => {
  const query =
    "select shipping_price, min_delivery_days, max_delivery_days from shipping_settings limit 1";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get shipping settings",
      });
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Shipping settings not found",
      });
    req.shippingSettings = results[0];
    next();
  });
};

const getPointsSettings = (req, res, next) => {
  const query =
    "select min_order_price, earning_percentage, max_redemption_percentage from points_settings limit 1";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get points settings",
      });
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Points settings not found",
      });
    req.pointsSettings = results[0];
    next();
  });
};

const getActivePromotion = (req, res, next) => {
  const query =
    "select * from promotions_settings where status='Active' and start_date<= now() and end_date> now() limit 1";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get active promotion",
      });
    req.activePromotion = results[0] || null;
    next();
  });
};

module.exports = {
  getShippingSettings,
  getPointsSettings,
  getActivePromotion,
};
