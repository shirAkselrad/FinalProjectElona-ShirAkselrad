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
  checkingRole,
  checkProduct,
  checkExisitingCart,
  createCartIfNeeded,
  checkExistingCartItem,
  addOrUpdateCartItem,
  calculateCartTotals,
  getClientsPoints,
  updateCartTotals,
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
  checkingRole,
  checkExisitingCart,
  getCartItems,
  getCartTotals,
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
  checkingRole,
  checkNewQuantity,
  checkProduct,
  checkExisitingCart,
  checkCartItemForUpdate,
  updateCartItemQuantity,
  calculateCartTotals,
  getClientsPoints,
  updateCartTotals,
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
  checkingRole,
  checkExisitingCart,
  removeCartItem,
  calculateCartTotals,
  deleteEmptyCart,
  checkIfCartDeleted,
  getClientsPoints,
  updateCartTotals,
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
  checkingRole,
  checkProcessingOrder,
  getCartItems,
  getCartTotals,
  getClientsPoints,
  calculateOrderSummary,
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
  checkingRole,
  checkExisitingCart,
  getCartTotals,
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
