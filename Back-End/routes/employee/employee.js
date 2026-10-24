const express = require("express");
const router = express.Router();

const clientsRouter = require("./clients");
const inventoryRoutes = require("./inventory/inventory");
const addProductRoutes = require("./inventory/addProduct");
const editProductRoutes = require("./inventory/editProduct");
const ordersRoutes = require("./orders");

//this middleware checks if the user is an employee
const checkIfEmployee = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  if (req.session.user.role?.toLowerCase() !== "employee")
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  next();
};
router.use("/", checkIfEmployee);
router.use("/", clientsRouter);
router.use("/", inventoryRoutes);
router.use("/", addProductRoutes);
router.use("/", editProductRoutes);
router.use("/", ordersRoutes);

module.exports = router;
