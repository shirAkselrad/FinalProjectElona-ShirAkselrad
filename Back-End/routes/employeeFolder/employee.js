const express = require("express");
const router = express.Router();

const clientsRouter = require("./clients/clients");
const inventoryRoutes = require("./inventory/inventory");
const ordersRoutes = require("./orders/orders");

const addProductRoutes = require("./products/addProduct/addProduct");
const editProductRoutes = require("./products/editProduct/editProduct");

//this middleware checks if the user is an employee or manager
const checkIfEmployee = (req, res, next) => {
  if (!req.session?.user)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });

  if (!["employee", "manager"].includes(req.session.user.role?.toLowerCase()))
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });

  next();
};

router.use("/", checkIfEmployee);
router.use("/", clientsRouter);
router.use("/", inventoryRoutes);
router.use("/", ordersRoutes);
router.use("/", addProductRoutes);
router.use("/", editProductRoutes);

module.exports = router;
