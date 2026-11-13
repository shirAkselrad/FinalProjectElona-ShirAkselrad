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

// Get pending refunds
const getPendingRefunds = (req, res, next) => {
  const query = `
    SELECT order_id, client_email, final_price, created_at
    FROM orders
    WHERE status='CANCELED' AND points_refunded=0
    ORDER BY order_id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get pending refunds",
      });
    }

    req.pendingRefunds = results;
    next();
  });
};

// Check refund eligibility
const checkRefund = (req, res, next) => {
  const query = `
    SELECT client_email, final_price
    FROM orders
    WHERE order_id=? AND status='CANCELED' AND points_refunded=0
    FOR UPDATE
  `;

  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) return refundError(req, res);

    if (!results.length) {
      return refundError(req, res, 409, "Order is not eligible for refund");
    }

    req.refund = results[0];
    next();
  });
};

// Check pending order items
// Check pending order items
const checkRefundItems = (req, res, next) => {
const query = `
  SELECT order_item_id, product_id, quantity
  FROM order_items
  WHERE order_id=? AND status='Inactive'
  FOR UPDATE
`;

  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) return refundError(req, res);

    if (!results.length) {
      return refundError(req, res, 409, "No items waiting for refund");
    }

    req.pendingRefundItems = results;
    req.pendingRefundCount = results.length;
    next();
  });
};

// Refund customer points
const refundPoints = (req, res, next) => {
  const { client_email, final_price } = req.refund;

  const query = "UPDATE users SET points=points+? WHERE email=?";

  req.connection.query(query, [final_price, client_email], (err, result) => {
    if (err || result.affectedRows !== 1) {
      return refundError(req, res);
    }

    next();
  });
};

// Mark all pending items as refunded
const markItemsRefunded = (req, res, next) => {
  const query = `
    UPDATE order_items
    SET status='Refunded'
    WHERE order_id=? AND status='Inactive'
  `;

  req.connection.query(query, [req.params.order_id], (err, result) => {
    if (err || result.affectedRows !== req.pendingRefundCount) {
      return refundError(req, res);
    }

    next();
  });
};

// Mark order refund as completed
const markRefunded = (req, res, next) => {
  const query = `
    UPDATE orders
    SET points_refunded=1
    WHERE order_id=? AND status='CANCELED' AND points_refunded=0
  `;

  req.connection.query(query, [req.params.order_id], (err, result) => {
    if (err || result.affectedRows !== 1) {
      return refundError(req, res);
    }

    next();
  });
};

// Approve refund

const restoreInventory = (req, res, next) => {
  const items = req.pendingRefundItems;
  let index = 0;

  const restoreNext = () => {
    if (index === items.length) return next();

    const item = items[index++];

    const query = `
      UPDATE inventory
      SET quantity=quantity+?
      WHERE product_id=?
    `;

    req.connection.query(
      query,
      [item.quantity, item.product_id],
      (err, result) => {
        if (err || result.affectedRows !== 1) {
          return refundError(req, res);
        }

        restoreNext();
      },
    );
  };

  restoreNext();
};


router.put(
  "/orders/:order_id/approveRefund",
  startRefund,
  checkRefund,
  checkRefundItems,
  restoreInventory,
  refundPoints,
  markItemsRefunded,
  markRefunded,
  completeRefund,
  sendStatusEmail,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Order refunded successfully",
    });
  },
);

// Get pending refunds
router.get("/pendingRefunds", getPendingRefunds, (req, res) => {
  return res.status(200).json({
    success: true,
    refunds: req.pendingRefunds,
  });
});

module.exports = router;
