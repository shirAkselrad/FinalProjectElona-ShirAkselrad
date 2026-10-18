const express = require("express");
const router = express.Router();

const clientsRouter = require("./clients");
const inventoryRoutes = require("./inventory/inventory");
const addProductRoutes = require("./inventory/addProduct");
const editProductRoutes = require("./inventory/editProduct");
const ordersRoutes = require("./orders"); 

router.use("/", clientsRouter);
router.use("/", inventoryRoutes);
router.use("/", addProductRoutes);
router.use("/", editProductRoutes);
router.use("/", ordersRoutes); 

module.exports = router;
