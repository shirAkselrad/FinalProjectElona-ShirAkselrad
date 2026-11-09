const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware creates a new promotion
const createPromotion = (req, res, next) => {
  const { name, discount_percentage, min_order_price, start_date, end_date } =
    req.body;
  const query = `insert into promotions_settings (name, discount_percentage, min_order_price, start_date, end_date, status) values (?, ?, ?, ?, ?, 'Not Active')`;
  db.query(
    query,
    [name, discount_percentage, min_order_price, start_date, end_date],
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

router.post("/createPromotion", createPromotion, (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Promotion has been created successfully",
    promotion_id: req.promotion_id,
  });
});

module.exports = router;
