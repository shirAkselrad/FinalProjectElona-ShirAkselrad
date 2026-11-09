const express = require("express");
const router = express.Router();

const { checkingRole } = require("./middlewares/cartRole");

const {
  checkProduct,
  checkExistingCartItem,
} = require("./middlewares/cartValidation");

const {
  checkExisitingCart,
  createCartIfNeeded,
} = require("./middlewares/cartManagement");

const { addOrUpdateCartItem } = require("./middlewares/cartItems");

const {
  calculateCartTotals,
  updateCartTotals,
} = require("./middlewares/cartTotals");

router.post(
  "/addToCart",
  checkingRole, //checking that the user's role is "Client"
  checkProduct, //checking that the requested amount of product exists in stock
  checkExisitingCart, //checking if the client already have a cart
  createCartIfNeeded, //creating a new cart if the client doesn't have one already
  checkExistingCartItem, //checking if the requested product already exists in the cart
  addOrUpdateCartItem, //updating the cart with the requested product
  calculateCartTotals, //calculating the totals order price and products amount (without points and shipping)
  updateCartTotals, //updating cart totals without points and shipping
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      order_id: req.cartOrderId,
    });
  },
);

module.exports = router;
