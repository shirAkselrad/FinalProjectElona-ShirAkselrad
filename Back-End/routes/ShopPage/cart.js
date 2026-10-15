const express = require("express");
const router = express.Router();

const {
  checkingRole,
  checkExisitingCart,
  createCartIfNeeded,
  checkProduct,
  checkExistingCartItem,
  addOrUpdateCartItem,
  calculateCartTotals,
  deleteEmptyCart,
  checkIfCartDeleted,
  updateCartTotals,
  getCartItems,
  getCartTotals,
  checkNewQuantity,
  checkCartItemForUpdate,
  updateCartItemQuantity,
  removeCartItem,
  getClientsPoints,
  calculateOrderSummary,
  checkProcessingOrder,
} = require("./cartMiddleware");

router.post(
  "/addToCart",
  checkingRole, //checking that the user's role is "Client"
  checkProduct, //checking that the requested amount of product exists in stock
  checkExisitingCart, //checking if the client already have a cart
  createCartIfNeeded, //creating a new cart if the client doesn't have one already
  checkExistingCartItem, //checking if the requested product already exists in the cart
  addOrUpdateCartItem, //updating the cart with the requested product
  calculateCartTotals, //calculating the totals order price and products amount (without points and shipping)
  getClientsPoints, //getting the amount of points the client has
  updateCartTotals, //calculating final price (after shipping and points)
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      order_id: req.cartOrderId,
    });
  },
);

router.get(
  "/getCart",
  checkingRole, //checking that the user's role is "Client"
  checkExisitingCart, //checking if the client already have a cart
  getCartItems, //getting all the current cart items by cartOrderId
  getCartTotals, //getting all the totals(order price-before points and shipping, final amount of products)
  (req, res) => {
    return res.status(200).json({
      success: true,
      order_id: req.cartOrderId,
      items: req.cartItems,
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);



router.put(
  "/updateQuantity",
  checkingRole, //checking that the user's role is "Client"
  checkNewQuantity, //saving the new requested amount of product to add to the current requested amount
  checkProduct, //checking that the requested amount of product exists in stock
  checkExisitingCart, //checking if the client already have a cart
  checkCartItemForUpdate, //checking if the product already exists in the cart
  updateCartItemQuantity, //updating the requested amount and final price of this amount (not for all the cart)
  calculateCartTotals, //calculating the totals order price and products amount (without points and shipping)
  getClientsPoints, //getting the amount of points the client has
  updateCartTotals, //calculating final price (after shipping and points)
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product Quantity updated successfully",
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);

router.delete(
  "/removeProduct",
  checkingRole, //checking that the user's role is "Client"
  checkExisitingCart, //checking if the client already have a cart
  removeCartItem, //removing the unwanted product from the cart (order_items)
  calculateCartTotals, //calculating the totals order price and products amount
  deleteEmptyCart, //in case there is no single product in the cart deleting the order (orders)
  checkIfCartDeleted, //checking if the cart was deleted (if yes, resting the order req info)
  getClientsPoints, //getting the amount of points the client has
  updateCartTotals, //calculating final price (after shipping and points)
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      total_items: req.cartTotals.total_items,
      total_price: req.cartTotals.total_price,
    });
  },
);

router.get(
  "/getOrderSummary",
  checkingRole, //checking that the user's role is "Client"
  checkProcessingOrder, //saving cartOrderId for the order which it's status is PROCESSING
  getCartItems, //getting all the current cart items by cartOrderId
  getCartTotals, //getting all the totals(order price-before points and shipping, final amount of products)
  getClientsPoints, //getting the amount of points the client has
  calculateOrderSummary,//saving all the calucaltes results for displaying in FE
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
