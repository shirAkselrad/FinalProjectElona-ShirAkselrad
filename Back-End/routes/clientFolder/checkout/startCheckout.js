const express = require("express");
const router = express.Router();

const { checkingRole } = require("../cart/middlewares/cartRole");

const { checkExisitingCart } = require("../cart/middlewares/cartManagement");

const { getCartTotals } = require("../cart/middlewares/cartTotals");

router.put(
  "/startCheckout",
  checkingRole, //checking that the user's role is "Client"
  checkExisitingCart, //checking if the client already have a cart
  getCartTotals, //getting all the totals(order price-before points and shipping, final amount of products)
  (req, res) => {
    if (req.cartOrderId === null) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (Number(req.cartTotals.total_items) <= 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot checkout with an empty cart",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order ready for checkout",
      order_id: req.cartOrderId,
    });
  },
);

module.exports = router;
