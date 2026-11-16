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
  getVatPercentage,
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
  checkUserLoggedIn, //checking if the user is logged in
  checkPayPalOrderId, //checking if the paypal order id is valid
  getProcessingOrder, //getting the proccessing order of the client (all info except the items)
  getShippingSettings, //getting the shipping settings
  getPointsSettings, //getting the points settings
  recoverPayPalOrder, //checking if the payment already accure (if yes save order id else paypal_status= details.status,capture_completed= false)
  beginPaymentTransaction, //starting payment transaction
  getVatPercentage, //getting vat
  updateOrderStatus, //changing the order status to 'PAID', refreshing the order total values
  getOrderItems, //getting all the cart items (product_id and quantity)
  updateInventory, //update the inventory after a successfull payment
  updateProductsStatus, //for products which shouldn't be restock and the stock is 0, 'Not Active' status
  updateClientPoints, //updating the amount of points the user has after successfull payment
  commitPaymentTransaction, //ending transaction
  sendConfirmationEmail, //sending email to the client
  completedPayment, //returning that payment was compeleted with the order id
  rollbackPaymentTransaction, //processing the roll back if there is an error
  handlePaymentError, //if there is an error message
);

module.exports = router;
