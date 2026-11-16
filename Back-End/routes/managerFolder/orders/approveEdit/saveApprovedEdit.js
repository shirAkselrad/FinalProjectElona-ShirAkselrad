const {
  rollbackEdit,
} = require("../../../employeeFolder/orders/editOrder/editTransaction");

const sendApprovedOrderEmail=require("./sendApprovedOrderEmail"); 

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
  const round = (value) => Number(value.toFixed(2));

  const productsTotal = req.activeItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0,
  );

  const totalItems = req.activeItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const discount = Number(order.general_discount_percentage || 0);

  const newTotal = round(productsTotal * (1 - discount / 100));
  const isFullCancellation = totalItems === 0;

  const oldFinalPrice = Number(order.final_price);
  const oldPointsUsed = Number(order.points_used);
  const oldEarned = Number(order.points_earned);
  const shipping = Number(order.shipping);

  const maxRedemption = Number(order.max_redemption_percentage || 0);

  const maxPoints = round((newTotal * maxRedemption) / 100);

  const pointsUsed = isFullCancellation
    ? 0
    : Math.min(oldPointsUsed, maxPoints);

  const finalPrice = isFullCancellation
    ? 0
    : round(newTotal - pointsUsed + shipping);

  // Refund for the amount actually paid
  const refund = round(oldFinalPrice - finalPrice);

  // Return previously redeemed points
  const returnedPoints = round(oldPointsUsed - pointsUsed);

  // Recalculate earned points proportionally
  const oldEligible = Math.max(0, oldFinalPrice - shipping);
  const newEligible = Math.max(0, finalPrice - shipping);

  const newEarned = isFullCancellation
    ? 0
    : oldEligible > 0
      ? Math.min(oldEarned, Math.round(oldEarned * (newEligible / oldEligible)))
      : oldEarned;

  const earnedToRemove = round(oldEarned - newEarned);

  if (refund < 0 || returnedPoints < 0 || earnedToRemove < 0) {
    const error = new Error("Invalid points calculation");
    error.status = 400;
    return rollbackEdit(error, req, res);
  }

  const pointsDifference = round(refund + returnedPoints - earnedToRemove);

  // Full cancellation keeps original financial details
  const orderQuery = isFullCancellation
    ? `
      UPDATE orders
      SET status='CANCELED',
          points_refunded=1,
          points_earned=0
      WHERE order_id=?
        AND status='PAID'
        AND points_refunded=0
    `
    : `
      UPDATE orders
      SET total_items=?,
          total_price=?,
          points_used=?,
          final_price=?,
          points_earned=?
      WHERE order_id=? AND status='PAID'
    `;

  const params = isFullCancellation
    ? [req.params.order_id]
    : [
        totalItems,
        productsTotal,
        pointsUsed,
        finalPrice,
        newEarned,
        req.params.order_id,
      ];

  req.connection.query(orderQuery, params, (err, result) => {
    if (err) return rollbackEdit(err, req, res);

    if (result.affectedRows !== 1) {
      return rollbackEdit(new Error("Couldn't update order"), req, res);
    }

    const pointsQuery = `
      UPDATE users
      SET points=points+?
      WHERE email=?
    `;

    req.connection.query(
      pointsQuery,
      [pointsDifference, order.client_email],
      (err, result) => {
        if (err) return rollbackEdit(err, req, res);

        if (result.affectedRows !== 1) {
          return rollbackEdit(
            new Error("Couldn't update client's points"),
            req,
            res,
          );
        }

        req.refund = refund;
        req.emailSummary = {
          original_total: oldFinalPrice,
          updated_total: finalPrice,
          refund_points: refund,
          returned_points: returnedPoints,
          reversed_earned_points: earnedToRemove,
          total_points_change: pointsDifference,
          is_full_cancellation: isFullCancellation,
          client_email: order.client_email,
        };
        next();
      },
    );
  });
};

// Save all changes only after every operation succeeds

const commitApproval = (req, res) => {
  req.connection.commit((err) => {
    if (err) return rollbackEdit(err, req, res);

    req.connection.release();

    // Send email only after the transaction is committed
    sendApprovedOrderEmail(req.params.order_id, req.emailSummary).catch(
      (error) => {
        console.error("Couldn't send order update email:", error);
      },
    );

    return res.status(200).json({
      success: true,
      message: "Order edit approved successfully",
      refund: req.refund,
    });
  });
};


module.exports = {
  approveEdit,
  updateOrderAndPoints,
  commitApproval,
};
