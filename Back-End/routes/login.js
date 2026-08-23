const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

module.exports = router;
