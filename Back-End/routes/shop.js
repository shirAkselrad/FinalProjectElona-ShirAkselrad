const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

//This path returns to front-end all products to be displays at the shop page
router.get("/getProducts", (req, res) => {
  const query = "select * from inventory where status='Active'";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Couldn't get products, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't get products",
      });
    }
    console.log("products were sent successfully to front-end");
    return res.status(200).json({
      success: true,
      products: results,
    });
  });
});

router.get("/getFrontImgs", (req, res) => {
  const query = `
  SELECT *
  FROM files
  WHERE file_number = 1
  AND product_id IN (
    SELECT product_id
    FROM inventory
    WHERE status = 'Active'
  )
`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Couldn't get product's front img, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't get products front images",
      });
    }
    console.log("products front  images were sent successfully to front-end");
    return res.status(200).json({
      success: true,
      imgs: results,
    });
  });
});

router.get("/getProductImgs/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  const query = "select * from files where product_id=? order by file_number";
  db.query(query, [product_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get product's images",
      });
    }
    return res.status(200).json({
      success: true,
      imgs: results,
    });
  });
});
module.exports = router;
