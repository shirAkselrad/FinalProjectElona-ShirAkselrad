const express = require("express");
const router = express.Router();

const clientsRouter = require("./clients");
const inventoryRoutes = require("./inventory/inventory");
const addProductRoutes = require("./inventory/addProduct");
const editProductRoutes = require("./inventory/editProduct");

router.use("/", clientsRouter);
router.use("/", inventoryRoutes);
router.use("/", addProductRoutes);
router.use("/", editProductRoutes);

module.exports = router;
