const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();
const { sendStatusEmail } = require("../emails/sendStatusEmail");

const {
  startRefund,
  completeRefund,
  refundError,
} = require("./refundsTransaction");

const getPendingRefunds = (req, res, next) => {
  const query = `select order_id, client_email, final_price, created_at from orders where status='CANCELED' and points_refunded=0 order by order_id desc`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get pending refunds",
      });
    req.pendingRefunds = results;
    next();
  });
};

const checkRefund = (req, res, next) => {
  const query = `select client_email, final_price from orders where order_id=? and status='CANCELED' and points_refunded=0 for update`;
  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) return refundError(req, res);
    if (results.length === 0)
      return refundError(req, res, 409, "Order already have been refunded");
    req.refund = results[0];
    next();
  });
};

const refundPoints = (req, res, next) => {
  const { client_email, final_price } = req.refund;
  const query = "update users set points=points+? where email=?";
  req.connection.query(query, [final_price, client_email], (err, result) => {
    if (err || result.affectedRows !== 1) return refundError(req, res);
    next();
  });
};

const markRefunded = (req, res, next) => {
  const query = "update orders set points_refunded=1 where order_id=?";
  req.connection.query(query, [req.params.order_id], (err, result) => {
    if (err || result.affectedRows !== 1) return refundError(req, res);
    next();
  });
};

router.put(
  "/orders/:order_id/approveRefund",
  startRefund,
  checkRefund,
  refundPoints,
  markRefunded,
  completeRefund,
  sendStatusEmail,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Points refunded successfully",
    });
  },
);

router.get("/pendingRefunds", getPendingRefunds, (req, res) => {
  return res.status(200).json({
    success: true,
    refunds: req.pendingRefunds,
  });
});

module.exports = router;
