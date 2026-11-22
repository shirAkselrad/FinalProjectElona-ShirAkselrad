const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets all promotions
const getPromotions = (req, res) => {
  const query = "select * from promotions_settings";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get promotions",
      });
    return res.status(200).json({
      success: true,
      promotions: results,
    });
  });
};

//this middleware deactivates expired promotions
const deactivateExpiredPromotion = (req, res, next) => {
  const query =
    "update promotions_settings set status='Not Active' where status='Active' and end_date<=now()";
  db.query(query, (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update expired promotions",
      });
    next();
  });
};

//this middleware activates a scheduled promotion
const activateScheduledPromotion = (req, res, next) => {
  const query = `update promotions_settings set status='Active' where status='Not Active' and start_date<=now() and end_date>now() and not exists(select 1 from (select promotion_id from promotions_settings where status='Active') as active_promotions) order by start_date, promotion_id limit 1`;
  db.query(query, (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't activate scheduled promotion",
      });
      next(); 
  });
};
router.get("/getGeneralPromotions", deactivateExpiredPromotion,activateScheduledPromotion, getPromotions);

module.exports = router;
