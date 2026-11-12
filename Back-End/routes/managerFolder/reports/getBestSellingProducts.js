const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//get paid orders from the last 12 months
const getPaidOrders = (req, res, next) => {
  const query = `select order_id from orders where status in('PAID','SHIPPED','COMPLETED') and created_at >= date_format(date_sub(curdate(), interval 11 month), '%Y-%m-01')`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get paid orders",
      });
    req.orders = results;
    next();
  });
};

//get quantities sold for each product
const getSoldProducts = (req, res, next) => {
  if (req.orders.length === 0) {
    req.soldProducts = [];
    return next();
  }

  const orderIds = req.orders.map((order) => order.order_id);
  const query = `select product_id,max(product_name) as product_name, sum(quantity) as quantity from order_items where order_id in (?) and status='Active' group by product_id order by quantity desc limit 10`;
  db.query(query, [orderIds], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get sold products",
      });
    req.soldProducts = results;
    next();
  });
};

//get products name
const getProductNames = (req, res, next) => {
  if (req.soldProducts.length === 0) {
    req.products = [];
    return next();
  }

  const productsId = req.soldProducts.map((product) => product.product_id);
  const query = `select product_id, name from inventory where product_id in (?)`;
  db.query(query, [productsId], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get product names",
      });
    req.products = results;
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
  getPaidOrders,
  getSoldProducts,
  getProductNames,
  calculateBestSellingProducts,
);
 module.exports=router; 