const express = require("express");
const router = express.Router();

const { router: getUserDetails } = require("./getUserDetails");
const updateUserDetails = require("./updateUserDetails");

router.use("/", getUserDetails);
router.use("/", updateUserDetails);

module.exports = router;
