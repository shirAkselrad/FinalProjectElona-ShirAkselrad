const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton")
const db = dbSingleton.getConnection();

const getPendingOrderEdits = (req, res, next) => {
  const query = `select orders.*, (select first_name from users where email=orders.client_email) as first_name, (select last_name from users where email=orders.client_email) as last_name from orders where status='PAID' and order_id in( select order_id from order_items where status='Inactive')`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get pending order edits",
      });
    req.pendingOrderEdits = results;
    next();
  });
};

router.get("/order/pendingEdits", getPendingOrderEdits, (req, res) => {
  res.status(200).json({
    success: true,
    orders: req.pendingOrderEdits,
  });
});

module.exports = router;