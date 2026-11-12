const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();
const getOrderFilterOptions = require("./getOrderFilterOptions");

//get available order statuses
router.get("/orders/filterOptions", getOrderFilterOptions);

//this path returns to front-end all the orders details
router.get("/orders", (req, res) => {
  const { status, search } = req.query;
  let query = `
  select
    order_id,
    client_email,
    (select first_name from users
     where email = orders.client_email) as first_name,
    (select last_name from users
     where email = orders.client_email) as last_name,
    total_items,
    created_at,
    min_delivery_date,
    max_delivery_date,
    (select name from promotions_settings
     where promotion_id = orders.promotion_id) as general_promotion,
    final_price,
    status
  from orders
`;
  const conditions = [];
  const params = [];
  if (status && status != "All Statuses") {
    conditions.push("status=?");
    params.push(status);
  }
  if (search?.trim()) {
    const searchValue = `%${search.trim()}%`;
    conditions.push(
      `(order_id like ? or client_email like ? or client_email in( select email from users where first_name like ? or last_name like ? or concat(first_name, ' ',last_name) like ?))`,
    );
    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
    );
  }

  if (conditions.length > 0) query += " where " + conditions.join(" and ");

  query += " order by order_id desc";

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get orders",
      });
    }
    return res.status(200).json({
      success: true,
      orders: results,
    });
  });
});

//this path responsible to pass all the order's products to FE
router.get("/orders/:order_id/items", (req, res) => {
  const { order_id } = req.params;
  const query =
    "select product_id, product_name, quantity,product_price,discount_percentage,discounted_product_price, total_price from order_items where order_id=?";
  db.query(query, [order_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order items",
      });
    return res.status(200).json({
      success: true,
      products: results,
    });
  });
});

module.exports = router;
