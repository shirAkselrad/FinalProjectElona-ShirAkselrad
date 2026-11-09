const express = require("express");
const router = express.Router();

const getPendingOrderEdits = require("./getPendingOrderEdits");
const approveEdit = require("./approveEdit/approveEdit");
const rejectEdit = require("./rejectEdit/rejectEdit");

router.use("/", getPendingOrderEdits);
router.use("/", approveEdit);
router.use("/", rejectEdit);

module.exports = router;
