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
  getVatPercentage,
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
  checkUserLoggedIn, //checking if the user is logged in
  checkPayPalOrderId, //checking if the payPal order id is valid
  getProcessingOrder, //getting the processing order of the client
  getShippingSettings, //getting the shipping settings
  getPointsSettings, //getting the points settings
  verifyPayment, //this middleware responsible to check that the order details are just the same as in the websit, to capture the payment and to check that the final price is the same as the order final price
  beginPaymentTransaction, //starting the transaction
  getVatPercentage, //getting the vat
  updateOrderStatus, //changing the order status to be 'PAID'
  getOrderItems, //getting all the order items
  updateInventory, //updating the inventory after a successfull payment
  updateProductsStatus, //updating a product status if needed (for products which shouldn't be restock)
  updateClientPoints, //updating the clients points
  commitPaymentTransaction, //ending the transaction
  sendConfirmationEmail, //sending a successfull payment email
  completedPayment, //returning that payment was compeleted with the order id
  rollbackPaymentTransaction, //if there is an error doing a roll back
  handlePaymentError, //sending message about the error
);
module.exports = router;
