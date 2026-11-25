const express = require("express");
const router = express.Router();
const getReportData = require("./getReportData");
const createReportHTML = require("./createReportHTML");
const generatePDF = require("./generatePDF");

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

//generate report for preview or download
router.get("/reports/:type", async (req, res) => {
  const { type } = req.params;
  const { from, to, download } = req.query;

  //checking the requested report type
  if (!Object.hasOwn(reportSettings, type))
    return res.status(400).json({
      success: false,
      message: "Invalid report type",
    });

  const settings = reportSettings[type];

  //checking if the report requires a date range
  const requiresDates = type === "inventory" || type === "orders";

  if (requiresDates) {
    if (!isValidDate(from) || !isValidDate(to) || from > to)
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
  }

  try {
    //getting the rows according to the report type
    const rows = await getReportData(type, from, to);

    //creating the HTML
    const html = createReportHTML(
      settings.title,
      settings.columns,
      rows,
      requiresDates ? from : null,
      requiresDates ? to : null,
    );

    //generating the PDF
    const pdf = await generatePDF(html);

    //determining whether to preview or download the report
    const disposition = download === "true" ? "attachment" : "inline";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${type}-report.pdf"`,
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
