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
} = require("../../middleware/cartMiddleware");

router.post(
  "/addToCart",
  checkingRole,
  checkProduct,
  checkExisitingCart,
  createCartIfNeeded,
  checkExistingCartItem,
  addOrUpdateCartItem,
  calculateCartTotals,
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

router.put("/startCheckout", checkingRole, checkExisitingCart, (req, res) => {
  if (req.cartOrderId === null)
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });

  const dbSingleton = require("../../dbSingleton");
  const db = dbSingleton.getConnection();

  const query = `
      update orders
      set status = 'PROCESSING'
      where order_id = ?
        and client_email = ?
        and status = 'CART'
        and total_items > 0
    `;

  db.query(query, [req.cartOrderId, req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update order status",
      });

    if (results.affectedRows === 0)
      return res.status(409).json({
        success: false,
        message: "Order cannot proceed to checkout",
      });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  });
});

module.exports = router;
