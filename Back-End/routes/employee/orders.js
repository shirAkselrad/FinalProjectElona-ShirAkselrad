const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();
const { sendStatusEmail } = require("./orders/orderStatusEmailMiddleware");

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

const startRefund = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get database connection",
      });
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't start refund",
        });
      }
      req.connection = connection;
      next();
    });
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

const completeRefund = (req, res, next) => {
  req.connection.commit((err) => {
    if (err) return refundError(req, res);
    req.connection.release();
    next();
  });
};

const refundError = (
  req,
  res,
  status = 500,
  message = "Couldn't refund points",
) => {
  req.connection.rollback(() => {
    req.connection.release();
    return res.status(status).json({
      success: false,
      message,
    });
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

//this path returns to front-end all the orders details
router.get("/orders", (req, res) => {
  const query = `
  select
    order_id,
    client_email,
    (select first_name from users
     where email = orders.client_email) as first_name,
    (select last_name from users
     where email = orders.client_email) as last_name,
    total_items,
    created_at,
    min_delivery_date,
    max_delivery_date,
    (select name from promotions_settings
     where promotion_id = orders.promotion_id) as general_promotion,
    final_price,
    status
  from orders
  order by order_id desc
`;
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

//this path responsible to pass all the order's products to FE
router.get("/orders/:order_id/items", (req, res) => {
  const { order_id } = req.params;
  const query =
    "select product_id, product_name, quantity,product_price,discount_percentage,discounted_product_price, total_price from order_items where order_id=?";
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
