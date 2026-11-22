const {
  rollbackEdit,
} = require("../../../employeeFolder/orders/editOrder/editTransaction");

const getPendingItems = (req, res, next) => {
  const orderQuery = `select status from orders where order_id=? and (status='PAID' or(status='CANCELED' and points_refunded=0)) for update`;
  req.connection.query(orderQuery, [req.params.order_id], (err, orders) => {
    if (err) return rollbackEdit(err, req, res);
    if (!orders.length) {
      const error = new Error("Order cannot be rejected");
      error.status = 400;
      return rollbackEdit(error, req, res);
    }
    req.isCanceled = orders[0].status === "CANCELED";
    const query = `select order_item_id from order_items where order_id=? and status='Inactive'`;
    req.connection.query(query, [req.params.order_id], (err, results) => {
      if (err) return rollbackEdit(err, req, res);
      if (!results.length) {
        const error = new Error("No pending order edit");
        error.status = 400;
        return rollbackEdit(error, req, res);
      }
      req.pendingIds = results.map((item) => item.order_item_id);
      next();
    });
  });
};

const rejectEdit = (req, res, next) => {
  const deleteQuery = `delete from order_items where order_id=? and status='Active' and replaces_order_item_id in (?)`;
  req.connection.query(
    deleteQuery,
    [req.params.order_id, req.pendingIds],
    (err) => {
      if (err) return rollbackEdit(err, req, res);

      const updateQuery = `update order_items set status='Active' where order_id=? and status='Inactive' and order_item_id in (?)`;
      req.connection.query(
        updateQuery,
        [req.params.order_id, req.pendingIds],
        (err, result) => {
          if (err) return rollbackEdit(err, req, res);

          if (result.affectedRows !== req.pendingIds.length) {
            return rollbackEdit(
              new Error("Couldn't restore original items"),
              req,
              res,
            );
          }

          // Partial edit - order is already PAID
          if (!req.isCanceled) return next();

          // Full cancellation - restore order to PAID
          const orderQuery = `update orders set status='PAID' where order_id=? and status='CANCELED' and points_refunded=0`;
          req.connection.query(
            orderQuery,
            [req.params.order_id],
            (err, result) => {
              if (err) return rollbackEdit(err, req, res);

              if (result.affectedRows !== 1) {
                return rollbackEdit(
                  new Error("Couldn't restore order status"),
                  req,
                  res,
                );
              }
              next();
            },
          );
        },
      );
    },
  );
};
const commitRejection = (req, res) => {
  req.connection.commit((err) => {
    if (err) return rollbackEdit(err, req, res);
    req.connection.release();
    res.status(200).json({
      success: true,
      message: "Order edit rejected successfully",
    });
  });
};

module.exports = {
  getPendingItems,
  rejectEdit,
  commitRejection,
};
