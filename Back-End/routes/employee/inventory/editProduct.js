const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This path updates the images on an existing product (Images popup)
router.put("/deleteProductImgs/:product_id", (req, res) => {
  const { imgs } = req.body;
  const { product_id } = req.params;
  const query =
    "delete from files where product_id=? and auto_file_name not in (?)";
  db.query(query, [product_id, imgs], (err, results) => {
    if (err) {
      console.log("Couldn't delete the proudct's imgs");
      return res.status(500).json({
        success: false,
        message: "Couldn't delete product's images",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product's images have been deleted successfully!",
    });
  });
});

router.get("/getProductImages/:product_id", (req, res) => {
  const { product_id } = req.params;
  const query = "select * from files where product_id=?";
  db.query(query, [product_id], (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Couldn't get the files",
      });
    } else {
      if (results.length == 0) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      } else {
        res.status(201).json({
          success: true,
          message: "Product's files found successfully",
          files: results,
        });
      }
    }
  });
});

//This path responsible of the updating product's details opeation
router.put("/editedProduct/:product_id", (req, res) => {
  const { product_id } = req.params;
  const {
    name,
    category,
    colors,
    country_origin,
    size,
    description,
    price,
    cost_price,
    discount,
    quantity,
    min_stock,
    status,
    restock_required,
    sales_check_date,
    min_sales,
  } = req.body;
  const query = `update inventory
    set name=?,
        category=?,
        colors=?,
        country_origin=?,
        size=?,
        description=?,
        price=?,
        cost_price=?,
        discount=?,
        quantity=?,
        min_stock=?,
        status=?,
        updated_at=NOW(),
        restock_required=?,
      sales_check_date=?,
      min_sales=?

    where product_id=?
  `;
  db.query(
    query,
    [
      name,
      category,
      colors,
      country_origin,
      size,
      description,
      price,
      cost_price,
      discount,
      quantity,
      min_stock,
      status,
      restock_required,
      sales_check_date,
      min_sales,
      product_id,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update product",
        });
      } else if (results.affectedRows == 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      } else
        return res.status(200).json({
          success: true,
          message: "Product was updated successfully!",
        });
    },
  );
});


module.exports = router;
