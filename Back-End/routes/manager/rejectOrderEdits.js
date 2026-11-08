const express = require("express");
const router = express.Router();
const {
  startEditTransaction,
  rollbackEdit,
} = require("../employee/orders/editOrder");

const getPendingItems = (req, res, next) => {
  const query = `select order_item_id from order_items where order_id=? and status='Inactive' and exists(select 1 from orders where order_id=? and status='PAID')`;
  req.connection.query(
    query,
    [req.params.order_id, req.params.order_id],
    (err, results) => {
      if (err) return rollbackEdit(err, req, res);
      if (!results.length) {
        const error = new Error("No pending order edit");
        error.status = 400;
        return rollbackEdit(error, req, res);
      }
      req.pendingIds = results.map((item) => item.order_item_id);
      next();
    },
  );
};

const rejectEdit = (req, res, next) => {
  const deleteQuery = `delete from order_items where order_id=? and status='Active' and replaces_order_item_id in (?)`;
  req.connection.query(
    deleteQuery,
    [req.params.order_id, req.pendingIds],
    (err) => {
      if (err) return rollbackEdit(err, req, res);
      const updateQuey = `update order_items set status='Active' where order_id=? and status='Inactive' and order_item_id in(?)`;
      req.connection.query(
        updateQuey,
        [req.params.order_id, req.pendingIds],
        (err, result) => {
          if (err) return rollbackEdit(err, req, res);
          if (result.affectedRows !== req.pendingIds.length)
            return rollbackEdit(
              new Error("Couldn't restore original items"),
              req,
              res,
            );
          next();
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

router.post(
  "/order/:order_id/rejectEdit",
  startEditTransaction,
  getPendingItems,
  rejectEdit,
  commitRejection,
);

module.exports = router;
