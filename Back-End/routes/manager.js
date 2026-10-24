const express = require("express");
const router = express.Router();

const usersRoutes = require("./manager/users");
const categoriesRoutes = require("./manager/categories");
const ordersRoutes = require("./employee/orders");
const inventoryRoutes = require("./employee/inventory/inventory");
const addProductRoutes = require("./employee/inventory/addProduct");
const editProductRoutes = require("./employee/inventory/editProduct");

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

module.exports = router;
