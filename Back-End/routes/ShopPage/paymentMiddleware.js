const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();
const { getPayPalAccessToken } = require("../../services/paypal");

const checkUserLoggedIn = (req, res, next) => {
  if (!req?.session?.user?.email)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  next();
};

const verifyPayment = async (req, res, next) => {
  const { paypal_order_id } = req.body;

  const order = req.order;

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
    // Verify that the PayPal order matches the local order
    if (
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

    // Only approved orders can be captured
    if (details.status !== "APPROVED") {
      return res.status(409).json({
        success: false,
        message: "PayPal order is not ready for capture",
      });
    }

    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypal_order_id)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `elona-capture-${paypal_order_id}`,
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
    req.orderId = order.order_id;
    next();
  } catch (error) {
    console.error("PayPal captureOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment service error",
    });
  }
};

const updateOrderStatus = (req, res, next) => {
  const query = `update orders set status="PAID" where order_id=? and client_email=? and status="PROCESSING"`;
  db.query(query, [req.orderId, req.session.user.email], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows !== 1)
      return next(new Error("Couldn't update order status"));
    next();
  });
};

const updateClientPoints = (req, res, next) => {
  const query = "update users set points=5 where email=?";
  db.query(query, [req.session.user.email], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows !== 1)
      return next(new Error("Couldn't update client's points"));
    next();
  });
};

const completedPayment = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Payment completed successfully",
    order_id: req.orderId,
  });
};

const getProcessingOrder = (req, res, next) => {
  const email = req.session.user.email;
  const query = `select * from orders where client_email=? and status="PROCESSING"`;
  db.query(query, [email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order details",
      });
    if (results.length !== 1)
      return res.status(409).json({
        success: false,
        message: "Expected exactly one processing order",
      });
    req.order = results[0];
    next();
  });
};

const checkPayPalOrderId = (req, res, next) => {
  const { paypal_order_id } = req.body || {};
  if (typeof paypal_order_id !== "string" || !paypal_order_id.trim())
    return res.status(400).json({
      success: false,
      message: "PayPal order ID is required",
    });
  next();
};

const createPayPalOrder = async (req, res) => {
  const order = req.order;
  try {
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
};

const recoverPayPalOrder = async (req, res) => {
  const { paypal_order_id } = req.body;
  const order = req.order;
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypal_order_id)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const details = await response.json();
    if (!response.ok)
      return res.status(502).json({
        success: false,
        message: "Couldn't verify PayPal order",
      });
    const purchaseUnit = details.purchase_units?.[0];
    if (
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
    const captures = purchaseUnit?.payments?.captures || [];
    const captureCompleted = captures.some(
      (capture) =>
        capture.status === "COMPLETED" &&
        capture.amount?.currency_code === "ILS" &&
        capture.amount?.value === Number(order.final_price).toFixed(2),
    );

    if (captureCompleted) {
      return res.status(409).json({
        success: false,
        message: "Payment was completed, but the order requires recovery",
        order_id: order.order_id,
        capture_completed: true,
      });
    }

    return res.status(200).json({
      success: true,
      order_id: order.order_id,
      paypal_status: details.status,
      capture_completed: false,
    });
  } catch (error) {
    console.error("PayPal recovery check error: ", error);
    return res.status(500).json({
      success: false,
      message: "Couldn't check payment status",
    });
  }
};

const checkPayPalOrderStatus = async (req, res) => {
  try {
    const { paypalOrderId } = req.params;
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Couldn't get PayPal order status",
      });
    }

    const captures = data.purchase_units?.[0]?.payments?.captures || [];

    return res.status(200).json({
      success: true,
      order_id: data.id,
      status: data.status,
      custom_id: data.purchase_units?.[0]?.custom_id,
      amount: data.purchase_units?.[0]?.amount,
      captures: captures.map((capture) => ({
        id: capture.id,
        status: capture.status,
        amount: capture.amount,
      })),
    });
  } catch (error) {
    console.error("PayPal status check error:", error);

    return res.status(500).json({
      success: false,
      message: "Couldn't check PayPal order",
    });
  }
};

module.exports = {
  checkUserLoggedIn,
  verifyPayment,
  updateOrderStatus,
  updateClientPoints,
  completedPayment,
  getProcessingOrder,
  checkPayPalOrderId,
  createPayPalOrder,
  recoverPayPalOrder,
  checkPayPalOrderStatus,
};
