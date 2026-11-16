const express = require("express");
const router = express.Router();

const { checkingRole } = require("./middlewares/cartRole");

const { checkExisitingCart } = require("./middlewares/cartManagement");

const { getCartItems } = require("./middlewares/cartItems");

const { getCartTotals } = require("./middlewares/cartTotals");

router.get(
  "/getCart",
  checkingRole, //checking that the user's role is "Client"
  checkExisitingCart, //checking if the client already have a cart
  getCartItems, //getting all the current cart items by cartOrderId
  getCartTotals, //getting all the totals(order price-before points and shipping, final amount of products)
  (req, res) => {
    return res.status(200).json({
      success: true,
      order_id: req.cartOrderId, //order id
      items: req.cartItems, // all the cart items info including front img
      total_items: req.cartTotals.total_items, //total amount of items in the cart
      total_price: req.cartTotals.total_price, //total price of all items in the cart
    });
  },
);

module.exports = router;
