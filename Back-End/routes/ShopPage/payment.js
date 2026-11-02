const express = require("express");
const router = express.Router();
const { sendConfirmationEmail } = require("./paymentEmailMiddleware");
const {
  getOrderItems,
  updateInventory,
  updateProductsStatus,
} = require("./updateInventoryMiddleware");
const {
  checkUserLoggedIn,
  beginPaymentTransaction,
  commitPaymentTransaction,
  rollbackPaymentTransaction,
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
const { getShippingSettings, getPointsSettings } = require("./cartMiddleware");

const handlePaymentError = (err, req, res, next) => {
  console.error("Payment processing error: ", err);
  return res.status(500).json({
    success: false,
    message: "Payment processing failed. Please check your order status",
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
  getShippingSettings,
  getPointsSettings,
  verifyPayment,
  beginPaymentTransaction,
  updateOrderStatus,
  getOrderItems,
  updateInventory,
  updateProductsStatus,
  updateClientPoints,
  commitPaymentTransaction,
  sendConfirmationEmail,
  completedPayment,
  rollbackPaymentTransaction,
  handlePaymentError,
);

// Temporary route to check an existing PayPal order status
router.get(
  "/checkPayPalOrder/:paypalOrderId",
  checkUserLoggedIn,
  checkPayPalOrderStatus,
);

// Check whether an existing PayPal order can be recovered
router.post(
  "/recoverOrder",
  checkUserLoggedIn,
  checkPayPalOrderId,
  getProcessingOrder,
  getShippingSettings,
  getPointsSettings,
  recoverPayPalOrder,
  beginPaymentTransaction,
  updateOrderStatus,
  getOrderItems,
  updateInventory,
  updateProductsStatus,
  updateClientPoints,
  commitPaymentTransaction,
  sendConfirmationEmail,
  completedPayment,
  rollbackPaymentTransaction,
  handlePaymentError,
);

module.exports = router;
