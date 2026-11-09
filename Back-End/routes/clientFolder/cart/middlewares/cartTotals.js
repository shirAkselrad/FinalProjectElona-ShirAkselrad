const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware calculates the final price to payment and the total amount of products in the cart
const calculateCartTotals = (req, res, next) => {
  const query = `
    select coalesce(sum(quantity),0) as total_items,
          coalesce(sum(total_price),0) as total_price
    from order_items
    where order_id=?
  `;

  db.query(query, [req.cartOrderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't calculate cart totals",
      });
    }
    req.cartTotals = results[0];
    next();
  });
};

//this middleware updates all the total values (total products in the cart, order price(includes discounts), final price- including the points and shippping price)
const updateCartTotals = (req, res, next) => {
  const query = `
  update orders
  set total_items=?,
      total_price=?,
      shipping=0,
      final_price=?,
      points_used=0
  where order_id=? and status='PROCESSING'
`;

  db.query(
    query,
    [
      req.cartTotals.total_items,
      req.cartTotals.total_price,
      req.cartTotals.total_price,
      req.cartOrderId,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update cart totals",
        });
      }

      if (results.affectedRows === 0) {
        return res.status(409).json({
          success: false,
          message: "Cart is not avaliable",
        });
      }

      next();
    },
  );
};

//this middleware save the totals (total price-before points and shipping, and total amount of products )
const getCartTotals = (req, res, next) => {
  if (req.cartOrderId === null) {
    req.cartTotals = {
      total_items: 0,
      total_price: 0,
    };
    return next();
  }

  const query = `
   select total_items, total_price, shipping, final_price
from orders
where order_id = ?
  `;

  db.query(query, [req.cartOrderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get cart totals",
      });
    }

    if (results.length === 0) {
      return res.status(409).json({
        success: false,
        message: "Cart is not available",
      });
    }

    req.cartTotals = results[0];
    next();
  });
};

module.exports = {
  calculateCartTotals,
  updateCartTotals,
  getCartTotals,
};
