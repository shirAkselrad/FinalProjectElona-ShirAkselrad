const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
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

//this middleware deactivate the current active promotion
const deactivateCurrentPromotion = (req, res, next) => {
  const query = `update promotions_settings set status="Not Active" where status="Active"`;
  db.query(query, (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't deactivate current promotions",
      });
    next();
  });
};

//this middleware creates a new promotion
const createPromotion = (req, res, next) => {
  const {
    name,
    discount_percentage,
    min_order_price,
    start_date,
    end_date,
    status,
  } = req.body;
  const query = `insert into promotions_settings (name, discount_percentage, min_order_price, start_date, end_date, status) values (?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [name, discount_percentage, min_order_price, start_date, end_date, status],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't add new promotion",
        });
      req.promotion_id = results.insertId;
      next();
    },
  );
};

//this middlewarre activates a choosen promotion
const activatePromotion = (req, res, next) => {
  const { promotion_id } = req.body;
  const query = `update promotions_settings set status="Active" where promotion_id=?`;
  db.query(query, [promotion_id], (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't activate promotion",
      });
    next();
  });
};

//this middleware deactivates a choosen promotion
const deactivatePromotion = (req, res, next) => {
  const { promotion_id } = req.body;
  const query = `update promotions_settings set status="Not Active" where promotion_id=?`;
  db.query(query, [promotion_id], (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't deactivate promotion",
      });
    next();
  });
};

router.get("/getGeneralPromotions", getPromotions);

router.post(
  "/createPromotion",
  (req, res, next) => {
    if (req.body.status !== "Active") return next();
    deactivateCurrentPromotion(req, res, next);
  },
  createPromotion,
  (req, res) => {
    return res.status(201).json({
      success: true,
      message: "Promotion has been created successfully",
      promotion_id: req.promotion_id,
    });
  },
);

router.put(
  "/activatePromotion",
  deactivateCurrentPromotion,
  activatePromotion,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Promotion activated successfully",
    });
  },
);

router.put("/deactivatePromםtion", deactivatePromotion, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Promotion deactivated successfully",
  });
});
module.exports = router;
