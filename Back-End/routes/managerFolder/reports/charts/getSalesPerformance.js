const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//get products
const getProducts = (req, res, next) => {
  const query = `
    select product_id, name, category, type, sales_check_date,min_sales
    from inventory
  `;

  db.query(query, (err, results) => {
    if (err) return next(err);

    res.locals.products = results;
    next();
  });
};

//get category targets
const getTargets = (req, res, next) => {
  const query = `
    select category_id, name, sales_check_days
    from category_types
  `;

  db.query(query, (err, results) => {
    if (err) return next(err);

    res.locals.targets = results;
    next();
  });
};

//get categories
const getCategories = (req, res, next) => {
  db.query("SELECT category_id, name FROM categories", (err, results) => {
    if (err) return next(err);

    res.locals.categories = results;
    next();
  });
};

//get active order items
const getOrderItems = (req, res, next) => {
  const query = `
    SELECT order_id, product_id, quantity
    FROM order_items
    WHERE status = 'Active'
  `;

  db.query(query, (err, results) => {
    if (err) return next(err);

    res.locals.orderItems = results;
    next();
  });
};

//get paid orders
const getOrders = (req, res, next) => {
  const query = `
    SELECT order_id, created_at
    FROM orders
    WHERE status IN ('PAID', 'SHIPPED', 'COMPLETED')
  `;

  db.query(query, (err, results) => {
    if (err) return next(err);

    res.locals.orders = results;
    next();
  });
};

//calculate sales performance for each product
const calculateProductPerformance = (product, data) => {
  const { categories, targets, orderItems, orders } = data;

  //finding the product's category
  const category = categories.find((item) => item.name === product.category);

  //finding the product's sales check period
  const targetData = targets.find(
    (item) =>
      item.category_id === category?.category_id && item.name === product.type,
  );

  if (!targetData || !product.sales_check_date) return null;

  const target = Number(product.min_sales);
  const days = Number(targetData.sales_check_days);

  if (
    !Number.isFinite(target) ||
    target <= 0 ||
    !Number.isFinite(days) ||
    days <= 0
  )
    return null;

  //calculating sales monitoring period
  const checkDate = new Date(product.sales_check_date);

  if (isNaN(checkDate.getTime())) return null;

  checkDate.setHours(0, 0, 0, 0);

  const startDate = new Date(checkDate);
  startDate.setDate(startDate.getDate() - days);

  //counting sold units during the monitoring period
  let sold = 0;

  orderItems.forEach((item) => {
    if (String(item.product_id) !== String(product.product_id)) return;

    const order = orders.find(
      (order) => String(order.order_id) === String(item.order_id),
    );

    if (!order) return;

    const orderDate = new Date(order.created_at);

    if (orderDate >= startDate && orderDate < checkDate)
      sold += Number(item.quantity);
  });

  return {
    product_id: product.product_id,
    name: product.name,
    category: product.category,
    type: product.type,
    min_sales: target,
    sales_check_days: days,
    units_sold: sold,
  };
};

//calculate and filter performance
const sendPerformance = (req, res) => {
  const { products, categories, targets, orderItems, orders } = res.locals;
  const { category, type, minDays, maxDays, minQuantity, maxQuantity } =
    req.query;

  const data = { categories, targets, orderItems, orders };

  //calculate performance
  const performance = products
    .map((product) => calculateProductPerformance(product, data))
    .filter((product) => product !== null);

  //filter results
  const filtered = performance.filter((product) => {
    if (
      category &&
      category !== "All Categories" &&
      product.category !== category
    )
      return false;

    if (type && type !== "All Types" && product.type !== type) return false;

    if (
      minDays !== "" &&
      minDays !== undefined &&
      product.sales_check_days < Number(minDays)
    )
      return false;

    if (
      maxDays !== "" &&
      maxDays !== undefined &&
      product.sales_check_days > Number(maxDays)
    )
      return false;

    if (
      minQuantity !== "" &&
      minQuantity !== undefined &&
      product.units_sold < Number(minQuantity)
    )
      return false;

    if (
      maxQuantity !== "" &&
      maxQuantity !== undefined &&
      product.units_sold > Number(maxQuantity)
    )
      return false;

    return true;
  });

  //filter options
  const categoryOptions = [...new Set(products.map((p) => p.category))].filter(
    Boolean,
  );

  const typeOptions = [];
  if (category && category !== "All Categories")
    products.forEach((p) => {
      if (p.category === category && p.type && !typeOptions.includes(p.type))
        typeOptions.push(p.type);
    });

  return res.status(200).json({
    success: true,
    performance: filtered,
    categories: categoryOptions,
    types: typeOptions,
    maxAvailableDays: Math.max(
      0,
      ...performance.map((p) => p.sales_check_days),
    ),
    maxAvailableQuantity: Math.max(0, ...performance.map((p) => p.units_sold)),
  });
};

//sales performance route
router.get(
  "/salesPerformance",
  getProducts,
  getCategories,
  getTargets,
  getOrderItems,
  getOrders,
  sendPerformance,
);

module.exports = router;
