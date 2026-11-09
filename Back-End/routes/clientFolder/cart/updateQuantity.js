const express = require("express");
const router = express.Router();

const { checkingRole } = require("./middlewares/cartRole");

const {
  checkProduct,
  checkCartItemForUpdate,
} = require("./middlewares/cartValidation");

const { checkExisitingCart } = require("./middlewares/cartManagement");

const { updateCartItemQuantity } = require("./middlewares/cartItems");

const {
  calculateCartTotals,
  updateCartTotals,
} = require("./middlewares/cartTotals");

router.put(
  "/updateQuantity",
  checkingRole, //checking that the user's role is "Client"
  checkProduct, //checking that the requested amount of product exists in stock
  checkExisitingCart, //checking if the client already have a cart
  checkCartItemForUpdate, //checking if the product already exists in the cart
  updateCartItemQuantity, //updating the requested amount and final price of this amount (not for all the cart)
  calculateCartTotals, //calculating the totals order price and products amount (without points and shipping)
  updateCartTotals, //updating cart totals without points and shipping
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product Quantity updated successfully",
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);

module.exports = router;
