const express = require("express");
const router = express.Router();

const usersRoutes = require("./users/users");
const categoriesRoutes = require("./categories/categories");
const ordersRoutes = require("../employeeFolder/orders/orders");
const inventoryRoutes = require("../employeeFolder/inventory/inventory");
const addProductRoutes = require("../employeeFolder/products/addProduct/addProduct");
const editProductRoutes = require("../employeeFolder/products/editProduct/editProduct");
const reviewsRouter = require("./reviews/reviews");
const shippingSettingsRoutes = require("./shipping/shipping");
const pointsSettingsRoutes = require("./points/points");
const generalPromotionsRoutes = require("./promotions/promotions");
const salesChartRoutes = require("./reports/getSalesChart"); 
const getSalesByCategory = require("./reports/getSalesByCategory");
const managerOrdersRoutes = require("./orders/orders");
const bestSellingProductsRoutes=require("./reports/getBestSellingProducts");
const orderByStatusRoutes=require("./reports/getOrderByStatus"); 

//this middleware check if the user is a manager
const checkIfManager = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  if (req.session.user.role?.toLowerCase() !== "manager")
    return res.status(403).json({
      success: false,
      message: "Access denied. Managers only!",
    });
  next();
};

router.use("/", checkIfManager);

router.use("/", usersRoutes);
router.use("/", categoriesRoutes);
router.use("/", ordersRoutes);
router.use("/", inventoryRoutes);
router.use("/", addProductRoutes);
router.use("/", editProductRoutes);
router.use("/", reviewsRouter);
router.use("/", shippingSettingsRoutes);
router.use("/", pointsSettingsRoutes);
router.use("/", generalPromotionsRoutes);
router.use("/", managerOrdersRoutes);
router.use("/", salesChartRoutes); 
router.use("/", getSalesByCategory); 
router.use("/", bestSellingProductsRoutes); 
router.use("/", orderByStatusRoutes); 

module.exports = router;
