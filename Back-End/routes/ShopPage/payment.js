const express = require("express");
const router = express.Router();
const { sendConfirmationEmail } = require("./paymentEmailMiddleware");
const {
  getOrderItems,
  updateInventory,
} = require("./updateInventoryMiddleware");
const {
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
} = require("./paymentMiddleware");

const handlePaymentError = (err, req, res, next) => {
  console.error("Payment processing error: ", err);
  return res.status(500).json({
    success: false,
    message: "Payment was captured, but order processing failed",
  });
};

router.post(
  "/createOrder",
  checkUserLoggedIn,
  getProcessingOrder,
  createPayPalOrder,
);

router.post(
  "/captureOrder",
  checkUserLoggedIn,
  checkPayPalOrderId,
  getProcessingOrder,
  verifyPayment,
  getOrderItems,
  updateInventory,
  updateOrderStatus,
  updateClientPoints,
  sendConfirmationEmail,
  completedPayment,
  handlePaymentError,
);

// Temporary route to check an existing PayPal order status
router.get("/checkPayPalOrder/:paypalOrderId",checkUserLoggedIn,checkPayPalOrderStatus);

// Check whether an existing PayPal order can be recovered
router.post(
  "/recoverOrder",
  checkUserLoggedIn,
  checkPayPalOrderId,
  getProcessingOrder,
  recoverPayPalOrder,
);

module.exports = router;
