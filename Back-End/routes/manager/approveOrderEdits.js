const express = require("express");
const router = express.Router();

const {
  startEditTransaction,
  rollbackEdit,
} = require("../employee/orders/editOrder");

// get the order and its pending changes
const getPendingEdit = (req, res, next) => {
  const orderQuery = `select *,
    (select discount_percentage from promotions_settings
     where promotion_id=orders.promotion_id)
    as general_discount_percentage
    from orders where order_id=? and status='PAID'`;

  req.connection.query(orderQuery, [req.params.order_id], (err, results) => {
    if (err) return rollbackEdit(err, req, res);

    if (!results.length) {
      const error = new Error("Order cannot be approved");
      error.status = 400;
      return rollbackEdit(error, req, res);
    }

    req.order = results[0];

    const itemsQuery = `select * from order_items where order_id=?`;

    req.connection.query(itemsQuery, [req.params.order_id], (err, items) => {
      if (err) return rollbackEdit(err, req, res);

      req.pendingItems = items.filter((item) => item.status === "Inactive");

      req.activeItems = items.filter((item) => item.status === "Active");

      if (!req.pendingItems.length) {
        const error = new Error("No pending changes");
        error.status = 400;
        return rollbackEdit(error, req, res);
      }

      next();
    });
  });
};

// restore removed quantities to inventory and mark old items as refunded
const approveEdit = (req, res, next) => {
  let index = 0;

  const approveNext = () => {
    if (index === req.pendingItems.length) return next();

    const oldItem = req.pendingItems[index++];

    const newItem = req.activeItems.find(
      (item) => item.replaces_order_item_id === oldItem.order_item_id,
    );

    // If the product was completely removed, the new quantity is zero
    const quantityToRestore =
      Number(oldItem.quantity) - Number(newItem?.quantity || 0);

    if (quantityToRestore <= 0) {
      const error = new Error("Invalid quantity difference");
      error.status = 400;
      return rollbackEdit(error, req, res);
    }

    const inventoryQuery = `update inventory
      set quantity=quantity+?
      where product_id=?`;

    req.connection.query(
      inventoryQuery,
      [quantityToRestore, oldItem.product_id],
      (err, result) => {
        if (err) return rollbackEdit(err, req, res);

        if (result.affectedRows !== 1)
          return rollbackEdit(
            new Error("Couldn't restore inventory"),
            req,
            res,
          );

        const updateQuery = `update order_items
          set status='Refunded'
          where order_item_id=? and order_id=? and status='Inactive'`;

        req.connection.query(
          updateQuery,
          [oldItem.order_item_id, req.params.order_id],
          (err, result) => {
            if (err) return rollbackEdit(err, req, res);

            if (result.affectedRows !== 1)
              return rollbackEdit(new Error("Couldn't approve item"), req, res);

            approveNext();
          },
        );
      },
    );
  };

  approveNext();
};

// recalculate order totals and refund the difference as loyalty points
const updateOrderAndPoints = (req, res, next) => {
  const order = req.order;

  // calculate the new product totals using the active items
  const productsTotal = req.activeItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0,
  );

  const totalItems = req.activeItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  // keep the original general promotion percentage
  const discount = Number(order.general_discount_percentage || 0);

  const newTotal = Number((productsTotal * (1 - discount / 100)).toFixed(2));


  const oldTotal =
    Number(order.final_price) -
    Number(order.shipping) +
    Number(order.points_used);

  // refund only the difference
  const refund = Number((oldTotal - newTotal).toFixed(2));

  if (refund < 0) {
    const error = new Error("Invalid refund amount");
    error.status = 400;
    return rollbackEdit(error, req, res);
  }


  const pointsUsed = Math.min(Number(order.points_used), newTotal);

  const finalPrice = Number(
    (newTotal - pointsUsed + Number(order.shipping)).toFixed(2),
  );

  const orderQuery = `update orders
    set total_items=?, total_price=?, points_used=?, final_price=?
    where order_id=? and status='PAID'`;

  req.connection.query(
    orderQuery,
    [totalItems, productsTotal, pointsUsed, finalPrice, req.params.order_id],
    (err, result) => {
      if (err) return rollbackEdit(err, req, res);

      if (result.affectedRows !== 1)
        return rollbackEdit(new Error("Couldn't update order"), req, res);

      // credit the customer with the approved refund
      const pointsQuery = `update users
        set points=points+?
        where email=?`;

      req.connection.query(
        pointsQuery,
        [refund, order.client_email],
        (err, result) => {
          if (err) return rollbackEdit(err, req, res);

          if (result.affectedRows !== 1)
            return rollbackEdit(new Error("Couldn't refund points"), req, res);

          req.refund = refund;
          next();
        },
      );
    },
  );
};

// Save all changes only after every operation succeeds
const commitApproval = (req, res) => {
  req.connection.commit((err) => {
    if (err) return rollbackEdit(err, req, res);

    req.connection.release();

    res.status(200).json({
      success: true,
      message: "Order edit approved successfully",
      refund: req.refund,
    });
  });
};

// ROUTE
router.post(
  "/order/:order_id/approveEdit",
  startEditTransaction,
  getPendingEdit,
  approveEdit,
  updateOrderAndPoints,
  commitApproval,
);

module.exports = router;
