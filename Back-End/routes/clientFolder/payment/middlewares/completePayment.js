//if the order wasn't paid yet, then changing the status of the order to be 'PROCESSING' and refreshing the total values of the order
const updateOrderStatus = (req, res, next) => {
  const query = `
    update orders
    set status='PAID',
        vat_percentage=?,
        min_delivery_date=date_add(
          date(created_at),
          interval ? day
        ),
        max_delivery_date=date_add(
          date_add(
            date(created_at),
            interval ? day
          ),
          interval ? day
        )
    where order_id=?
      and client_email=?
      and status='PROCESSING'
  `;
  req.paymentDb.query(
    query,
    [
      req.vatPercentage,
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

//updating the amount of points the user has after successfull payment
const updateClientPoints = (req, res, next) => {
  //order details
  const order = req.order;
  //points which used by the client in the order
  const pointsUsed = Number(order.points_used);

  //points which have been earned by the client after the payment
  const earnedPoints = Math.round(
    (Math.max(0, Number(order.final_price) - Number(order.shipping)) *
      Number(req.pointsSettings.earning_percentage)) /
      100,
  );

  const orderQuery =
    "update orders set points_earned=? where order_id=? and status='PAID'";
  req.paymentDb.query(
    orderQuery,
    [earnedPoints, req.orderId],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows !== 1)
        return next(new Error("Couldn't save earned points"));
      const userQuery = `update users set points=points-?+? where email=?`;
      req.paymentDb.query(
        userQuery,
        [pointsUsed, earnedPoints, req.session.user.email],
        (err, result) => {
          if (err) return next(err);
          if (result.affectedRows != 1)
            return next(new Error("Couldn't update client's points"));
          next();
        },
      );
    },
  );
};

//returning that payment was compeleted with the order id 
const completedPayment = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Payment completed successfully",
    order_id: req.orderId,
  });
};

//get current VAT percentage
const getVatPercentage = (req, res, next) => {
  const query = `select vat_percentage from vat_settings where vat_id=1`;
  req.paymentDb.query(query, (err, results) => {
    if (err) return next(err);
    if (!results.length) return next(new Error("VAT settings not found"));
    req.vatPercentage = Number(results[0].vat_percentage);
    next();
  });
};
module.exports = {
  getVatPercentage,
  updateOrderStatus,
  updateClientPoints,
  completedPayment,
};
