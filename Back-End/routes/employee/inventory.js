const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();



//This path returns all the inventory details from back-end to front-end
router.get("/inventory", (req, res) => {
  
console.log("INVENTORY ROUTER LOADED");
  const query = "select  * from inventory";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Could not get inventory, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Could not get inventory",
      });
    }
    return res.status(200).json({
      success: true,
      inventory: results,
    });
  });
});

module.exports = router;
