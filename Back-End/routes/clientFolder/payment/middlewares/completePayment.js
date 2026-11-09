const updateOrderStatus = (req, res, next) => {
  const query = `
  update orders
  set status = "PAID",
      min_delivery_date =date_add(date(created_at), interval ? day),
      max_delivery_date = date_add(
        date_add(date(created_at), interval ? day),
        interval ? day
      )
  where order_id = ?
    and client_email = ?
    and status = "PROCESSING"
`;
  req.paymentDb.query(
    query,
    [
      req.shippingSettings.min_delivery_days,
      req.shippingSettings.min_delivery_days,
      req.shippingSettings.max_delivery_days,
      req.orderId,
      req.session.user.email,
    ],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows !== 1)
        return next(new Error("Couldn't update order status"));
      next();
    },
  );
};

const updateClientPoints = (req, res, next) => {
  const order = req.order;
  const pointsUsed = Number(order.points_used);
  const earnedPoints = Math.round(
    (Math.max(0, Number(order.final_price) - Number(order.shipping)) *
      Number(req.pointsSettings.earning_percentage)) /
      100,
  );
  const query = "update users set points=points-?+? where email=?";
  req.paymentDb.query(
    query,
    [pointsUsed, earnedPoints, req.session.user.email],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows !== 1)
        return next(new Error("Couldn't update client's points"));
      next();
    },
  );
};

const completedPayment = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Payment completed successfully",
    order_id: req.orderId,
  });
};

module.exports = {
  updateOrderStatus,
  updateClientPoints,
  completedPayment,
};
