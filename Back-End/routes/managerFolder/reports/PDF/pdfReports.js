const express = require("express");
const router = express.Router();
const getReportData = require("./getReportData");
const createReportHTML = require("./createReportHTML");
const generatePDF = require("./generatePDF");
const {
  getProducts,
  getCategories,
  getCategoryTargets,
  getOrderItems,
  getOrders,
  calculatePerformance,
} = require("./getSalesPerformance");

//report settings
const reportSettings = {
  users: {
    title: "Users Report",
    columns: [
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "username", label: "Username" },
      { key: "phone_num", label: "Phone" },
      { key: "city", label: "City" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
      { key: "points", label: "Points" },
    ],
  },

  inventory: {
    title: "Inventory Report",
    columns: [
      { key: "product_id", label: "Product ID" },
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "type", label: "Type" },
      { key: "colors", label: "Colors" },
      { key: "size", label: "Size" },
      { key: "price", label: "Price" },
      { key: "discount", label: "Discount" },
      { key: "quantity", label: "Quantity" },
      { key: "min_stock", label: "Min Stock" },
      { key: "status", label: "Status" },
      { key: "creation_date", label: "Created At" },
    ],
  },

  orders: {
    title: "Orders Report",
    columns: [
      { key: "order_id", label: "Order ID" },
      { key: "client_email", label: "Client" },
      { key: "total_items", label: "Items" },
      { key: "total_price", label: "Total Price" },
      { key: "shipping", label: "Shipping" },
      { key: "points_used", label: "Points Used" },
      { key: "final_price", label: "Final Price" },
      { key: "status", label: "Status" },
      { key: "created_at", label: "Created At" },
    ],
  },
  performance: {
    title: "Sales Performance Report",
    columns: [
      { key: "product_id", label: "Product ID" },
      { key: "name", label: "Product Name" },
      { key: "category", label: "Category" },
      { key: "type", label: "Type" },
      { key: "min_sales", label: "Target" },
      { key: "sales_check_days", label: "Days" },
      { key: "check_date", label: "Check Date" },
      { key: "units_sold", label: "Sold" },
      { key: "difference", label: "Difference" },
      { key: "achievement", label: "Achievement" },
      { key: "performance", label: "Performance" },
    ],
  },
};

//check valid date format
function isValidDate(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

router.get(
  "/reports/performance",
  getProducts,
  getCategories,
  getCategoryTargets,
  getOrderItems,
  getOrders,
  calculatePerformance,
  async (req, res) => {
    try {
      const settings = reportSettings.performance;
      const html = createReportHTML(
        settings.title,
        settings.columns,
        res.locals.performanceData,
      );
      const pdf = await generatePDF(html);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="performance-report.pdf"',
      );
      return res.send(pdf);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate performance report",
      });
    }
  },
);

//generate report
router.get("/reports/:type", async (req, res) => {
  const { type } = req.params;
  const { from, to } = req.query;
  console.log("PDF report type:", type);
  const settings = reportSettings[type];
  if (!settings||type==="performance")
    return res.status(400).json({
      success: false,
      message: "Invalid report type",
    });

  //users report does not require dates
  if (type !== "users") {
    if (!isValidDate(from) || !isValidDate(to) || from > to)
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
  }
  try {
    console.log("Getting report data...");
    const rows = await getReportData(type, from, to);

    console.log("Data received:", rows.length);

    const html = createReportHTML(
      settings.title,
      settings.columns,
      rows,
      type === "users" ? null : from,
      type === "users" ? null : to,
    );

    console.log("HTML created");

    const pdf = await generatePDF(html);

    console.log("PDF generated");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${type}-report.pdf"`,
    );

    return res.send(pdf);
  } catch (error) {
    console.error("PDF Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  }
});


module.exports = router;
