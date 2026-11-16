const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//get paid orders from last 12 months
const getPaidOrders = (req, res, next) => {
  const query = `select order_id from orders where status in('PAID','SHIPPED','COMPLETED') and created_at>=date_format(date_sub(curdate(), interval 11 month), '%Y-%m-01')`;

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get paid orders",
      });

    req.orders = results; //all the orders which have been paid/shipped/completed at the last 12 months
    next();
  });
};

//get order items
const getOrderItems = (req, res, next) => {
  if (req.orders.length === 0) {
    req.orderItems = [];
    return next();
  }
  //only orders ids
  const orderIds = req.orders.map((order) => order.order_id);
  //all the active items that have been sold by orders
  const query = `select product_id, total_price from order_items where order_id in (?) and status='Active'`;

  db.query(query, [orderIds], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order items",
      });

    req.orderItems = results; //product_id, total_price
    next();
  });
};

//get product categories and types
const getProductCategories = (req, res, next) => {
  const query = `select product_id, category, type from inventory`;

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get product categories",
      });

    req.products = results; //product_id, category, type
    next();
  });
};

//calculate sales by category and type
const calculateSalesByCategories = (req, res) => {
  const sales = [];

  req.orderItems.forEach((item) => {
    //find the ordered product in the inventory
    const product = req.products.find((p) => p.product_id === item.product_id);

    if (!product) return;

    //find the category of the product
    let category = sales.find((c) => c.category === product.category);

    if (!category) {
      category = {
        category: product.category,
        sales: 0,
        types: [],
      };
      sales.push(category);
    }

    //add price sales to category.sale (total sales price)
    category.sales += Number(item.total_price);

    //find the category type
    let type = category.types.find((t) => t.type === (product.type || "Other"));

    if (!type) {
      type = {
        type: product.type || "Other",
        sales: 0,
      };
      category.types.push(type);
    }

    //add sales to type
    type.sales += Number(item.total_price);
  });

  return res.status(200).json({
    success: true,
    sales,
  });
};

router.get(
  "/salesByCategory",
  getPaidOrders, //get paid orders from last 12 months
  getOrderItems, //get order items
  getProductCategories, //get product categories and types
  calculateSalesByCategories, //for each category and category type calculating the total sales price
);

module.exports = router;
