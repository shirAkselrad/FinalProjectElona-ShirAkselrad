const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

router.get("/orders/:orderId/points", (req, res) => {
  const email = req.session.user?.email;
  if (!email) {
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  }

  const orderQuery = `
    select points_earned
    from orders
    where order_id = ?
      and client_email = ?
      and status in ('PAID', 'SHIPPED', 'COMPLETED')
  `;

  db.query(orderQuery, [req.params.orderId, email], (err, orders) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get order points",
      });
    }

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const pointsQuery = `
      select points
      from users
      where email = ?
    `;

    db.query(pointsQuery, [email], (err, users) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't get client points",
        });
      }

      if (!users.length) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }

      return res.status(200).json({
        success: true,
        points_earned: Number(orders[0].points_earned),
        total_points: Number(users[0].points),
      });
    });
  });
});

module.exports = router;
