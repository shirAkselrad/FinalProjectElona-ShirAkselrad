const express = require("express");
const router = express.Router();

const clientsRouter = require("./clients");
const inventoryRouter = require("./inventory");

router.use("/", clientsRouter);
router.use("/", inventoryRouter);

module.exports = router;
