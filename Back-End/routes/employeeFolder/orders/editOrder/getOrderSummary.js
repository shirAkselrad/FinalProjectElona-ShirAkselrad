const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();



const getOrderSummary = (req, res, next) => {
const query = `
  select order_id, status, total_items, total_price,
    points_used, points_earned, shipping, final_price,
    vat_percentage, promotion_id,
    min_delivery_date, max_delivery_date,

    (select discount_percentage
     from promotions_settings
     where promotion_id = orders.promotion_id)
    as general_discount_percentage,

    (select max_redemption_percentage
     from points_settings limit 1)
    as max_redemption_percentage

  from orders
  where order_id = ?
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

//get order items 
const getOrderSummaryItems = (req, res, next) => {
  const query = `
    select order_item_id, order_id, product_id,
      product_name, quantity,
      product_price as original_price,
      discount_percentage as discount,
      discounted_product_price as sale_price,
      total_price, status, replaces_order_item_id
    from order_items
    where order_id=?
    order by order_item_id
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

// Calculate order summary
const calculateOrderSummary = (req, res, next) => {
  const order = req.orderSummary;

  const round = (value) => Number(value.toFixed(2));

  // Original products before order edits
  const originalItems = order.items.filter(
    (item) => item.replaces_order_item_id == null,
  );

  const originalTotal = originalItems.reduce(
    (sum, item) =>
      sum + Number(item.original_price) * Number(item.quantity),
    0,
  );

  // Use the updated totals saved in the orders table
  const finalTotal = Number(order.final_price);

  const totalAfterPromotions =
    finalTotal - Number(order.shipping) + Number(order.points_used);

  order.original_total = round(originalTotal);
  order.total_after_promotions = round(totalAfterPromotions);
  order.promotions_discount = round(
    originalTotal - totalAfterPromotions,
  );
  order.final_total = round(finalTotal);

  next();
};

module.exports = {
  getOrderSummary,
  getOrderSummaryItems,
  calculateOrderSummary,
};
