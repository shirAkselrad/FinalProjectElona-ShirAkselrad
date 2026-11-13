const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

// Get products
const getProducts = (req, res, next) => {
  const query = `
    SELECT product_id, name, category, type, sales_check_date
    FROM inventory
  `;

  db.query(query, (err, rows) => {
    if (err) return next(err);

    res.locals.products = rows;
    next();
  });
};

// Get categories
const getCategories = (req, res, next) => {
  const query = `
    SELECT category_id, name
    FROM categories
  `;

  db.query(query, (err, rows) => {
    if (err) return next(err);

    res.locals.categories = rows;
    next();
  });
};

// Get category targets
const getCategoryTargets = (req, res, next) => {
  const query = `
    SELECT category_id, name, min_sales, sales_check_days
    FROM category_types
  `;

  db.query(query, (err, rows) => {
    if (err) return next(err);

    res.locals.targets = rows;
    next();
  });
};

// Get order items
const getOrderItems = (req, res, next) => {
  const query = `
    SELECT order_id, product_id, quantity, status
    FROM order_items
  `;

  db.query(query, (err, rows) => {
    if (err) return next(err);

    res.locals.orderItems = rows;
    next();
  });
};

// Get orders
const getOrders = (req, res, next) => {
  const query = `
    SELECT order_id, created_at, status
    FROM orders
  `;

  db.query(query, (err, rows) => {
    if (err) return next(err);

    res.locals.orders = rows;
    next();
  });
};

// Calculate performance
const calculatePerformance = (req, res, next) => {
  const { products, categories, targets, orderItems, orders } = res.locals;

  const today = new Date();

  const results = products.map((product) => {
    const category = categories.find((c) => c.name === product.category);

    const targetData = targets.find(
      (t) => t.category_id === category?.category_id && t.name === product.type,
    );

    const target = Number(targetData?.min_sales);
    const days = Number(targetData?.sales_check_days);

    // Product without a valid target
    if (!targetData || target <= 0 || days <= 0 || !product.sales_check_date) {
      return {
        ...product,
        min_sales: targetData?.min_sales ?? null,
        sales_check_days: targetData?.sales_check_days ?? null,
        units_sold: 0,
        difference: null,
        achievement: null,
        performance: "Not Configured",
      };
    }

    const checkDate = new Date(product.sales_check_date);

    // Start of the current sales period
    const startDate = new Date(checkDate);
    startDate.setDate(startDate.getDate() - days);

    // Get sales for this product in the current period
    let sold = 0;

    orderItems.forEach((item) => {
      if (String(item.product_id) !== String(product.product_id)) return;
      if (item.status !== "Active") return;

      const order = orders.find(
        (o) => String(o.order_id) === String(item.order_id),
      );

      if (!order) return;
      if (!["PAID", "SHIPPED", "COMPLETED"].includes(order.status)) return;

      const orderDate = new Date(order.created_at);

      if (orderDate >= startDate && orderDate < checkDate) {
        sold += Number(item.quantity);
      }
    });

    const difference = sold - target;
    const achievement = ((sold / target) * 100).toFixed(1);

    let performance;

    if (sold > target) {
      performance = "Exceeded";
    } else if (sold === target) {
      performance = "Met";
    } else if (today < checkDate) {
      performance = "In Progress";
    } else {
      performance = "Below Target";
    }

    return {
      product_id: product.product_id,
      name: product.name,
      category: product.category,
      type: product.type,
      min_sales: target,
      sales_check_days: days,
      check_date: checkDate.toLocaleDateString("en-GB"),
      units_sold: sold,
      difference,
      achievement: `${achievement}%`,
      performance,
    };
  });

  res.locals.performanceData = results;
  next();
};

module.exports = {
  getProducts,
  getCategories,
  getCategoryTargets,
  getOrderItems,
  getOrders,
  calculatePerformance,
};
