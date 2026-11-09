const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

// GET ORDER SUMMARY

const getOrderSummary = (req, res, next) => {
  const query = `
  SELECT order_id, status, total_items, total_price,
    points_used, shipping, final_price, promotion_id,
    min_delivery_date, max_delivery_date,

    (SELECT discount_percentage
     FROM promotions_settings
     WHERE promotion_id = orders.promotion_id)
    AS general_discount_percentage,

    (SELECT max_redemption_percentage
     FROM points_settings LIMIT 1)
    AS max_redemption_percentage

  FROM orders
  WHERE order_id = ?
`;
  db.query(query, [req.params.order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order summary",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    req.orderSummary = results[0];
    next();
  });
};

const getOrderSummaryItems = (req, res, next) => {
  const query = `
    SELECT order_item_id, order_id, product_id,
      product_name, quantity,
      product_price AS original_price,
      discount_percentage AS discount,
      discounted_product_price AS sale_price,
      total_price, status, replaces_order_item_id
    FROM order_items
    WHERE order_id=?
    ORDER BY order_item_id
  `;
  db.query(query, [req.params.order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order products",
      });

    req.orderSummary.items = results;
    next();
  });
};

const calculateOrderSummary = (req, res, next) => {
  const order = req.orderSummary;
  const round = (value) => Number(value.toFixed(2));

  const originalItems = order.items.filter(
    (item) => item.replaces_order_item_id == null,
  );

  const originalTotal = originalItems.reduce(
    (sum, item) => sum + Number(item.original_price) * Number(item.quantity),
    0,
  );

  const productsTotal = originalItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0,
  );

  const discount = Number(order.general_discount_percentage || 0);

  const afterPromotions = round(productsTotal * (1 - discount / 100));

  order.original_total = round(originalTotal);
  order.total_after_promotions = afterPromotions;
  order.promotions_discount = round(originalTotal - afterPromotions);
  order.final_total = round(
    afterPromotions - Number(order.points_used) + Number(order.shipping),
  );

  next();
};

module.exports = {
  getOrderSummary,
  getOrderSummaryItems,
  calculateOrderSummary,
};
