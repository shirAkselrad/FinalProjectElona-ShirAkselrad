const express = require("express");
const router = express.Router();

const { checkUserLoggedIn } = require("./middlewares/paymentValidation");

const { checkPayPalOrderStatus } = require("./middlewares/paypalOperation");

// Temporary route to check an existing PayPal order status
router.get(
  "/checkPayPalOrder/:paypalOrderId",
  checkUserLoggedIn,
  checkPayPalOrderStatus,
);

module.exports = router;
