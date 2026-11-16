const { getPayPalAccessToken } = require("../../../../services/paypal");

//this middleware responsible to check that the order details are just the same as in the websit, to capture the payment and to check that the final price is the same as the order final price
const verifyPayment = async (req, res, next) => {
  const { paypal_order_id } = req.body;
  const order = req.order;

  try {
    const accessToken = await getPayPalAccessToken(); //for the requests which will be sent from the server to paypal
    //getting order details
    const detailsResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypal_order_id)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const details = await detailsResponse.json();
    //request failed 
    if (!detailsResponse.ok)
      return res.status(502).json({
        success: false,
        message: "Couldn't verify PayPal order",
      });
    const purchaseUnit = details.purchase_units?.[0];//array which includes all the purching units 
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

    //processing the payment 
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
    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];//if payment successed getting all the payment values 
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

//checking if paypal already completed a payment while the FE didn't get an approvent from it
const recoverPayPalOrder = async (req, res, next) => {
  //getting paypal_order_id
  const { paypal_order_id } = req.body;
  //order info
  const order = req.order;
  try {
    const accessToken = await getPayPalAccessToken(); //let the server sending requests to the payal server
    //url paypal
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypal_order_id)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, //let the paypal server response
        },
      },
    );
    const details = await response.json(); //the response
    if (!response.ok)
      return res.status(502).json({
        success: false,
        message: "Couldn't verify PayPal order",
      });
    const purchaseUnit = details.purchase_units?.[0]; //purching array in paypal

    if (
      details.purchase_units?.length !== 1 || //checking there if there is at least one purching
      purchaseUnit?.custom_id !== String(order.order_id) || //checking if the order_id fits
      purchaseUnit?.amount?.currency_code !== "ILS" || //checking if the money is shekel
      purchaseUnit?.amount?.value !== Number(order.final_price).toFixed(2) //checking if the final price fits to the final price of the order
    ) {
      return res.status(409).json({
        success: false,
        message: "PayPal order verification failed",
        paypal_status: details.status,
        capture_completed: false,
      });
    }

    //contains all the operations of the payment
    const captures = purchaseUnit?.payments?.captures || [];
    const captureCompleted = captures.some(
      (capture) =>
        capture.status === "COMPLETED" &&
        capture.amount?.currency_code === "ILS" &&
        capture.amount?.value === Number(order.final_price).toFixed(2),
    );

    if (captureCompleted) {
      req.orderId = order.order_id;
      return next();
    }

    return res.status(409).json({
      success: false,
      message: "Payment has not been captured",
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
  verifyPayment,
  createPayPalOrder,
  recoverPayPalOrder,
  checkPayPalOrderStatus,
};
