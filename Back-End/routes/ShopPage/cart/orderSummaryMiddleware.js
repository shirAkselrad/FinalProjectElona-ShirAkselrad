const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets the client's points and save them in req.clientPoints
const getClientsPoints = (req, res, next) => {
  const query = "select points from users where email=?";

  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get client points",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    req.clientPoints = Number(results[0].points) || 0;
    next();
  });
};

//this middleware save all the order calculates results to display in front-end

const calculateOrderSummary = (req, res, next) => {
  const originalTotal = req.cartItems.reduce(
    (sum, item) => sum + Number(item.original_price) * Number(item.quantity),
    0,
  );

  const totalPrice = Number(req.cartTotals.total_price);
  const promotion = req.activePromotion;
  const round = (value) => Number(value.toFixed(2));

  const generalDiscount =
    promotion && totalPrice >= Number(promotion.min_order_price)
      ? round((totalPrice * Number(promotion.discount_percentage)) / 100)
      : 0;

  const totalAfterPromotions = round(totalPrice - generalDiscount);
  const promotionsDiscount = round(originalTotal - totalAfterPromotions);

  const shipping = Number(req.shippingSettings.shipping_price);
  const pointsSettings = req.pointsSettings;

  const maxPoints = round(
    (totalAfterPromotions * Number(pointsSettings.max_redemption_percentage)) /
      100,
  );

  const pointsUsed =
    totalAfterPromotions >= Number(pointsSettings.min_order_price)
      ? Math.min(Math.max(0, req.clientPoints), maxPoints)
      : 0;
  const finalTotal = round(totalAfterPromotions - pointsUsed + shipping);

  req.orderSummary = {
    original_total: originalTotal,
    promotions_discount: promotionsDiscount,
    total_after_promotions: totalAfterPromotions,
    available_points: req.clientPoints,
    points_used: pointsUsed,
    shipping,
    min_delivery_days: Number(req.shippingSettings.min_delivery_days),
    max_delivery_days: Number(req.shippingSettings.max_delivery_days),
    final_total: finalTotal,
    promotion_id: generalDiscount > 0 ? promotion.promotion_id : null,
  };

  next();
};

const saveOrderSummary = (req, res, next) => {
  const summary = req.orderSummary;

  const query = `
    UPDATE orders
    SET shipping=?, final_price=?, points_used=?, promotion_id=?
    WHERE order_id=? AND client_email=? AND status='PROCESSING'
  `;

  db.query(
    query,
    [
      summary.shipping,
      summary.final_total,
      summary.points_used,
      summary.promotion_id,
      req.cartOrderId,
      req.session.user.email,
    ],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update final price",
        });

      if (results.affectedRows === 0)
        return res.status(404).json({
          success: false,
          message: "Processing order not found",
        });

      req.cartTotals.final_price = summary.final_total;
      next();
    },
  );
};

//this middleware saves the orderId of the order which it's status is PROCESSING
const checkProcessingOrder = (req, res, next) => {
  const query =
    "select order_id from orders where client_email=? and status='PROCESSING' limit 1";

  db.query(query, [req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get processing order",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Processing order not found",
      });

    req.cartOrderId = results[0].order_id;
    next();
  });
};

module.exports = {
  getClientsPoints,
  calculateOrderSummary,
  saveOrderSummary,
  checkProcessingOrder,
};
