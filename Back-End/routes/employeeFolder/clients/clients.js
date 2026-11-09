const express = require("express");
const router = express.Router();

const getClients = require("./getClients");
const updateClient = require("./updateClient");
const changeClientStatus = require("./changeClientStatus");

router.use("/", getClients);
router.use("/", updateClient);
router.use("/", changeClientStatus);

module.exports = router;
