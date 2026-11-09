const express = require("express");
const router = express.Router();

const { checkingRole } = require("../cart/middlewares/cartRole");

const { getCartItems } = require("../cart/middlewares/cartItems");

const { getCartTotals } = require("../cart/middlewares/cartTotals");

const {
  getClientsPoints,
  checkProcessingOrder,
} = require("./middlewares/orderDetails");

const {
  calculateOrderSummary,
  saveOrderSummary,
} = require("./middlewares/orderSummary");

const {
  getShippingSettings,
  getPointsSettings,
  getActivePromotion,
} = require("./middlewares/orderSettings");

router.get(
  "/getOrderSummary",
  checkingRole, //checking that the user's role is "Client"
  checkProcessingOrder, //saving cartOrderId for the order which it's status is PROCESSING
  getCartItems, //getting all the current cart items by cartOrderId
  getCartTotals, //getting all the totals(order price-before points and shipping, final amount of products)
  getClientsPoints, //getting the amount of points the client has
  getShippingSettings,
  getPointsSettings,
  getActivePromotion,
  calculateOrderSummary, //saving all the calucaltes results for displaying in FE
  saveOrderSummary,
  (req, res) => {
    return res.status(200).json({
      success: true,
      order_id: req.cartOrderId,
      items: req.cartItems,
      total_items: req.cartTotals.total_items,
      ...req.orderSummary,
    });
  },
);

module.exports = router;
