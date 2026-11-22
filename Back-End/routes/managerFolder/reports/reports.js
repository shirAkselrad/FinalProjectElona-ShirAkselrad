const express = require("express");
const router = express.Router();

const salesChartRoutes = require("./charts/getSalesChart");
const salesByCategoryRoutes = require("./charts/getSalesByCategory");
const bestSellingProductsRoutes = require("./charts/getBestSellingProducts");
const orderByStatusRoutes = require("./charts/getOrderByStatus");
const salesPerformanceRoutes = require("./charts/getSalesPerformance");

const pdfReportsRoutes = require("./PDF/pdfReports");

router.use("/", salesChartRoutes);
router.use("/", salesByCategoryRoutes);
router.use("/", bestSellingProductsRoutes);
router.use("/", orderByStatusRoutes);
router.use("/", salesPerformanceRoutes);
router.use("/", pdfReportsRoutes);

module.exports = router;
