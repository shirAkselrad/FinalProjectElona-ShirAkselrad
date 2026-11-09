const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();
const { sendStatusEmail } = require("./emails/sendStatusEmail");

const checkOrderEditable = (req, res, next) => {
  const { order_id } = req.params;
  const query = "select status from orders where order_id=?";
  db.query(query, [order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check order status",
      });
    if (results.length == 0)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    if (results[0].status !== "PAID")
      return res.status(403).json({
        success: false,
        message: "Only PAID orders can be edited",
      });
    next();
  });
};

//this path updated order's status
router.put(
  "/orders/:order_id/status",
  checkOrderEditable,
  (req, res, next) => {
    const { order_id } = req.params;
    const { status } = req.body;
    if (!["SHIPPED", "COMPLETED", "CANCELED"].includes(status))
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });

    const query =
      "update orders set status=? where order_id=? and status='PAID'";
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

module.exports = router;
