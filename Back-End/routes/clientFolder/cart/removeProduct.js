const express = require("express");
const router = express.Router();

const { checkingRole } = require("./middlewares/cartRole");

const {
  checkExisitingCart,
  deleteEmptyCart,
  checkIfCartDeleted,
} = require("./middlewares/cartManagement");

const { removeCartItem } = require("./middlewares/cartItems");

const {
  calculateCartTotals,
  updateCartTotals,
} = require("./middlewares/cartTotals");

router.delete(
  "/removeProduct",
  checkingRole, //checking that the user's role is "Client"
  checkExisitingCart, //checking if the client already have a cart
  removeCartItem, //removing the unwanted product from the cart (order_items)
  calculateCartTotals, //calculating the totals order price and products amount
  deleteEmptyCart, //in case there is no single product in the cart deleting the order (orders)
  checkIfCartDeleted, //checking if the cart was deleted (if yes, resting the order req info)
  updateCartTotals, //updating cart totals without points and shipping
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);

module.exports = router;
