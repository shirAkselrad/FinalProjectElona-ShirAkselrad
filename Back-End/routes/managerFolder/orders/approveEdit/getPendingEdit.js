const {
  rollbackEdit,
} = require("../../../employeeFolder/orders/editOrder/editTransaction");

// get the order and its pending changes
const getPendingEdit = (req, res, next) => {
const orderQuery = `
  SELECT *,
    (SELECT discount_percentage
     FROM promotions_settings
     WHERE promotion_id=orders.promotion_id)
    AS general_discount_percentage,

    (SELECT max_redemption_percentage
     FROM points_settings
     LIMIT 1)
    AS max_redemption_percentage

  FROM orders
  WHERE order_id=? AND status='PAID'
  FOR UPDATE
`;

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

module.exports = getPendingEdit;
