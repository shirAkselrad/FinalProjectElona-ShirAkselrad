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
  select *
  from files
  where frontImg = 1
  and product_id in (
    select product_id
    from inventory
    where status = 'Active'
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
module.exports = router;
