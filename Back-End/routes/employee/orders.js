const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();
const { sendStatusEmail } = require("./orders/orderStatusEmailMiddleware");

//this path returns to front-end all the orders details
router.get("/orders", (req, res) => {
  const query =
    "select order_id, client_email, (select first_name from users where email=orders.client_email) as first_name, (select last_name from users where email=orders.client_email) as last_name, total_items, created_at, final_price, status from orders order by order_id desc";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get orders",
      });
    }
    return res.status(200).json({
      success: true,
      orders: results,
    });
  });
});

//this path updated order's status
router.put(
  "/orders/:order_id/status",
  (req, res, next) => {
    const { order_id } = req.params;
    const { status } = req.body;
    if (!["SHIPPED", "COMPLETED", "CANCELED"].includes(status))
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });

    const query = "update orders set status=? where order_id=?";
    db.query(query, [status, order_id], (err, result) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update order's status",
        });
      if (result.affectedRows === 0)
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      next();
    });
  },
  sendStatusEmail,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  },
);

//this path responsible to pass all the order's products to FE
router.get("/orders/:order_id/items", (req, res) => {
  const { order_id } = req.params;
  const query =
    "select product_id, product_name, quantity,product_price, total_price from order_items where order_id=?";
  db.query(query, [order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order items",
      });
    return res.status(200).json({
      success: true,
      products: results,
    });
  });
});
module.exports = router;
