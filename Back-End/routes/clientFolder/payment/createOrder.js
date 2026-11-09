const express = require("express");
const router = express.Router();

const {
  checkUserLoggedIn,
  getProcessingOrder,
} = require("./middlewares/paymentValidation");

const { createPayPalOrder } = require("./middlewares/paypalOperation");

router.post(
  "/createOrder",
  checkUserLoggedIn,
  getProcessingOrder,
  createPayPalOrder,
);

module.exports = router;
