const express = require("express");
const router = express.Router();

const { sendConfirmationEmail } = require("./middlewares/paymentEmail");

const {
  getOrderItems,
  updateInventory,
  updateProductsStatus,
} = require("./middlewares/updateInventory");

const {
  getShippingSettings,
  getPointsSettings,
} = require("../checkout/middlewares/orderSettings");

const {
  checkUserLoggedIn,
  getProcessingOrder,
  checkPayPalOrderId,
} = require("./middlewares/paymentValidation");

const {
  beginPaymentTransaction,
  commitPaymentTransaction,
  rollbackPaymentTransaction,
} = require("./middlewares/paymentTransaction");

const {
  updateOrderStatus,
  updateClientPoints,
  completedPayment,
} = require("./middlewares/completePayment");

const { recoverPayPalOrder } = require("./middlewares/paypalOperation");

const handlePaymentError = (err, req, res, next) => {
  console.error("Payment processing error: ", err);
  return res.status(500).json({
    success: false,
    message: "Payment processing failed. Please check your order status",
  });
};

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
