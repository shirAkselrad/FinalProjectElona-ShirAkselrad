const {
  rollbackEdit,
} = require("../../../employeeFolder/orders/editOrder/editTransaction");

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

module.exports = getPendingEdit;
