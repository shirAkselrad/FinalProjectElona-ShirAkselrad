const express = require("express");
const router = express.Router();

const getUsers = require("./getUsers");
const updateUser = require("./updateUser");
const changeUserStatus = require("./changeUserStatus");

router.use("/", getUsers);
router.use("/", updateUser);
router.use("/", changeUserStatus);

module.exports = router;
