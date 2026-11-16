const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();
const sendApprovedOrderEmail = require("../../../managerFolder/orders/approveEdit/sendApprovedOrderEmail");

const {
  startRefund,
  completeRefund,
  refundError,
} = require("./refundsTransaction");

// Get pending refunds
const getPendingRefunds = (req, res, next) => {
  const query = `
    select order_id, client_email, final_price, created_at
    from orders
    where status='CANCELED' and points_refunded=0
    order by order_id desc
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
    select client_email, final_price,points_used,points_earned
    from orders
    where order_id=? and status='CANCELED' and points_refunded=0
    for update
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
const checkRefundItems = (req, res, next) => {
  const query = `
  select order_item_id, product_id, quantity,status,replaces_order_item_id
  from order_items
  where order_id=? 
  for update
`;

  req.connection.query(query, [req.params.order_id], (err, results) => {
    if (err) return refundError(req, res);

    const pendingItems = results.filter((item) => item.status === "Inactive"); //all items which are waiting to be refund

    //no pending items in the requested order
    if (!pendingItems.length) {
      return refundError(req, res, 409, "No items waiting for refund");
    }

    req.pendingRefundItems = pendingItems; //all the items which are waiting to be refund (inactive lines)
    req.pendingRefundCount = pendingItems.length; //total count of inactive items
    next();
  });
};

// Refund customer points

const refundPoints = (req, res, next) => {
  const { client_email, final_price, points_used, points_earned } = req.refund;

  //the amount of points which will be returned to the user minus the points the user earned after the payment
  const pointsDifference =
    Number(final_price) + Number(points_used) - Number(points_earned);

  const query = `
    update users
    set points=points+?
    where email=?
  `;

  req.connection.query(
    query,
    [pointsDifference, client_email],
    (err, result) => {
      if (err || result.affectedRows !== 1) {
        return refundError(req, res);
      }

      req.emailSummary = {
        original_total: Number(final_price), //final price (after ponits_used, shipping and promotions )
        updated_total: 0, //total price left after refund (the whole order was canceled )
        refund_points: Number(final_price), //amount of points which have been refunded (final price)
        returned_points: Number(points_used), //the points the user paid with and returned after the cancellation
        reversed_earned_points: Number(points_earned), //the amount of points which have been taken back since the order was canceled
        total_points_change: Number(pointsDifference.toFixed(2)), //the difference between points that have been taken back to the points that have been given to the user
        is_full_cancellation: true, //all the order was canceled
        client_email, //the email of the canceled order
      };

      next();
    },
  );
};

// Mark all pending items as refunded
const markItemsRefunded = (req, res, next) => {
  const query = `
    update order_items
    set status='Refunded'
    where order_id=? and status='Inactive'
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
    update orders
    set points_refunded=1,points_earned=0
    where order_id=? and status='CANCELED' and points_refunded=0
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
  const items = req.pendingRefundItems; //all the inactive items

  //returns all the items which don't have a replacement
  const itemsToRestore = items.filter((item) => {
    //there is no other line which suppost to replace it
    if (item.replaces_order_item_id == null) return true;
    //finding the line which is replacing the current inactive line
    const original = items.find(
      (oldItem) => oldItem.order_item_id === item.replaces_order_item_id,
    );
    return !original;
  });

  let index = 0;
  const restoreNext = () => {
    //already restored all the items
    if (index === itemsToRestore.length) return next();
    const item = itemsToRestore[index++];
    const query = `
      update inventory
      set quantity=quantity+?
      where product_id=?
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

//finding all the canceled orders which have been refunded yet
const checkRejectedRefund = (req, res, next) => {
  const query = `select order_id from orders where order_id=? and status='CANCELED' and points_refunded=0 for update`;
  req.connection.query(query, [req.params.order_id], (err, result) => {
    if (err) return refundError(req, res);
    if (!result.length)
      return refundError(req, res, 409, "Order cannot be restored");
    next();
  });
};

//activting all the order items lines which have been inactive and changing the order status from CANCELED to be PAID
const rejectRefund = (req, res, next) => {
  const itemsQuery = `update order_items set status='Active' where order_id=? and status='Inactive'`;
  req.connection.query(itemsQuery, [req.params.order_id], (err) => {
    if (err) return refundError(req, res);
    const orderQuery = `update orders set status='PAID' where order_id=? and status='CANCELED' and points_refunded=0`;
    req.connection.query(orderQuery, [req.params.order_id], (err, result) => {
      if (err || result.affectedRows !== 1) return refundError(req, res);
      next();
    });
  });
};

const sendRefundEmail = (req, res, next) => {
  sendApprovedOrderEmail(req.params.order_id, req.emailSummary).catch((err) => {
    console.error("Couldn't send refund email:", err);
  });

  next();
};

router.put(
  "/orders/:order_id/approveRefund",
  startRefund, //starting the refund transaction
  checkRefund, //getting the email, total_price, points_used and points_earned (of the canceled order)
  checkRefundItems, //saving the inactive items and the amount of them
  restoreInventory, //restoring all the items which don't have a replacement lines
  refundPoints, //returning the user the amount of points for the order
  markItemsRefunded, //all the lines which have been refunded change the status to be 'Refunded'
  markRefunded, //marking the order as a canceled order which have been refunded
  completeRefund, //ending the transaction
  sendRefundEmail, //sending the client an email with the refunded order
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Order refunded successfully",
    });
  },
);

router.put(
  "/orders/:order_id/rejectRefund",
  startRefund, //starting the refund transaction
  checkRejectedRefund, //finding all the canceled orders which have been refunded yet
  rejectRefund, //activting all the order items lines which have been inactive and changing the order status to be PAID
  completeRefund, //ending the transaction
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Order cancellation rejected successfully",
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
