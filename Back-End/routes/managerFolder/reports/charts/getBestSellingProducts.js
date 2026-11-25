const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//get paid orders id from the last 12 months including the current month
const getPaidOrders = (req, res, next) => {
  const { from, to } = req.query;
  const values = [];

  let query = `select order_id from orders where status in ('PAID','SHIPPED','COMPLETED')`;

  //filtering by start date
  if (from) {
    query += " and created_at >=?";
    values.push(from);
  }

  //filtering by end date
  if (to) {
    query += " and created_at < date_add(?, interval 1 day)";
    values.push(to);
  }
  db.query(query, values,(err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get paid orders",
      });
    req.orders = results; //saving all the paid orders ids
    next();
  });
};

//getting the 10 best selling products
const getSoldProducts = (req, res, next) => {
  //if there are no orders
  if (req.orders.length === 0) {
    req.soldProducts = [];
    return next();
  }

  //gettings the orders from the json ids array
  const orderIds = req.orders.map((order) => order.order_id);
  const query = `select product_id,max(product_name) as product_name, sum(quantity) as quantity from order_items where order_id in (?) and status='Active' group by product_id order by quantity desc limit 10`;
  db.query(query, [orderIds], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get sold products",
      });
    req.soldProducts = results; //saving the id, name,quantity of each best selling products
    next();
  });
};

//get products name of the 10 best selling products
const getProductNames = (req, res, next) => {
  if (req.soldProducts.length === 0) {
    req.products = [];
    return next();
  }

  //getting the id of each product
  const productsId = req.soldProducts.map((product) => product.product_id);
  const query = `select product_id, name from inventory where product_id in (?)`;
  db.query(query, [productsId], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get product names",
      });
    req.products = results; //getting the product id and the product name
    next();
  });
};

//prepare data for the chart
const calculateBestSellingProducts = (req, res) => {
  const products = req.soldProducts.map((item) => {
    const product = req.products.find((p) => p.product_id === item.product_id);
    return {
      product: product?.name || item.product_name,
      quantity: Number(item.quantity),
    };
  });
  return res.status(200).json({
    success: true,
    products,
  });
};

router.get(
  "/bestSellingProducts",
  getPaidOrders, //getting paid orders within the selected period
  getSoldProducts, //getting the 10 best selling products
  getProductNames, //getting the product id and names of the 10 best sellings
  calculateBestSellingProducts, //saving in proper way for the chart the names and the qauntity
);
module.exports = router;
