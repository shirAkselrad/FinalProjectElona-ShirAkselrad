const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();
const { getPayPalAccessToken } = require("../../services/paypal");

router.post("/createOrder", (req, res) => {
  if (!req.session?.user?.email)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  const email = req.session.user.email;
  const query = `select order_id, final_price from orders where client_email=? and status='PROCESSING'`;
  db.query(query, [email], async (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order details",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Processing order  not found",
      });

    if (results.length > 1) {
      return res.status(409).json({
        success: false,
        message: "Multiple processing orders found",
      });
    }
    const order = results[0];

    try {
      //getting an access token from paypal
      const accessToken = await getPayPalAccessToken();
      const response = await fetch(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                custom_id: String(order.order_id),
                amount: {
                  currency_code: "ILS",
                  value: Number(order.final_price).toFixed(2),
                },
              },
            ],
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("PayPal create order error: ", data);
        return res.status(502).json({
          success: false,
          message: "Couldn't create PayPal order",
        });
      }
      return res.status(201).json({
        success: true,
        paypal_order_id: data.id,
      });
    } catch (error) {
      console.error("PayPal error:", error);
      return res.status(500).json({
        success: false,
        message: "Payment service error",
      });
    }
  });
});

router.post("/captureOrder", async (req, res) => {
  if (!req.session?.user?.email) {
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  }
  const email = req.session.user.email;
  const { paypal_order_id } = req.body;
  if (!paypal_order_id || typeof paypal_order_id !== "string") {
    return res.status(400).json({
      success: false,
      message: "PayPal order ID is required",
    });
  }

  const query =
    "select order_id, final_price from orders where client_email=? and status='PROCESSING'";
  db.query(query, [email], async (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order details",
      });

    if (results.length !== 1) {
      return res.status(409).json({
        success: false,
        message: "Expected exactly one processing order",
      });
    }
    const order = results[0];

    try {
      const accessToken = await getPayPalAccessToken();
      const detailsResponse = await fetch(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypal_order_id)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const details = await detailsResponse.json();
      if (!detailsResponse.ok)
        return res.status(502).json({
          success: false,
          message: "Couldn't verify PayPal order",
        });
      const purchaseUnit = details.purchase_units?.[0];
      if (
        details.status !== "APPROVED" ||
        details.purchase_units?.length !== 1 ||
        purchaseUnit?.custom_id !== String(order.order_id) ||
        purchaseUnit?.amount?.currency_code !== "ILS" ||
        purchaseUnit?.amount?.value !== Number(order.final_price).toFixed(2)
      ) {
        return res.status(409).json({
          success: false,
          message: "PayPal order verification failed",
        });
      }

      const response = await fetch(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypal_order_id)}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (!response.ok)
        return res.status(502).json({
          success: false,
          message: "Couldn't capture PayPal payment",
        });
      const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
      if (
        data.status !== "COMPLETED" ||
        capture?.status != "COMPLETED" ||
        capture?.amount?.currency_code != "ILS" ||
        capture?.amount?.value !== Number(order.final_price).toFixed(2)
      ) {
        return res.status(409).json({
          success: false,
          message: "Payment was not confirmed as completed",
        });
      }
      const updateQuery = `
  UPDATE orders
  SET status = 'PAID'
  WHERE order_id = ?
    AND client_email = ?
    AND status = 'PROCESSING'
`;

      db.query(updateQuery, [order.order_id, email], (err, result) => {
        if (err) {
          console.error("Couldn't update order status:", err);

          return res.status(500).json({
            success: false,
            message: "Payment completed, but order update failed",
          });
        }

        if (result.affectedRows !== 1) {
          return res.status(409).json({
            success: false,
            message: "Order status could not be updated",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Payment completed successfully",
          order_id: order.order_id,
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Payment service error",
      });
    }
  });
});
module.exports = router;
