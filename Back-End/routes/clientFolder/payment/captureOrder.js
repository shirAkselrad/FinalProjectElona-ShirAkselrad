const express = require("express");
const router = express.Router();

const { sendConfirmationEmail } = require("./middlewares/paymentEmail");

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

const { verifyPayment } = require("./middlewares/paypalOperation");

const {
  updateOrderStatus,
  updateClientPoints,
  completedPayment,
} = require("./middlewares/completePayment");

const {
  getShippingSettings,
  getPointsSettings,
} = require("../checkout/middlewares/orderSettings");

const {
  getOrderItems,
  updateInventory,
  updateProductsStatus,
} = require("./middlewares/updateInventory");

const handlePaymentError = (err, req, res, next) => {
  console.error("Payment processing error: ", err);
  return res.status(500).json({
    success: false,
    message: "Payment processing failed. Please check your order status",
  });
};

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

module.exports = router;
