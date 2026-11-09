const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const getPriceRange = (req, res, next) => {
  const query = `select min(price*(1-discount/100)) as minPrice,max(price*(1-discount/100)) as maxPrice from inventory where status='Active' and category in(select name from categories where status='Active') and type in(select name from category_types where status='Active' )`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get price range",
      });
    req.priceRange = results[0];
    next();
  });
};

const getAvailableColors = (req, res, next) => {
  const query = `select colors from inventory where status='Active' and category in(select name from categories where status='Active') and type in(select name from category_types where status='Active')`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get available colors",
      });
    const colors = [];
    results.forEach((product) => {
      if (product.colors) {
        product.colors.split(",").forEach((color) => {
          const colorName = color.trim();
          if (colorName && !colors.includes(colorName)) colors.push(colorName);
        });
      }
    });
    req.availableColors = colors.sort();
    next();
  });
};

router.get(
  "/getFilterOptions",
  getPriceRange,
  getAvailableColors,
  (req, res) => {
    return res.status(200).json({
      success: true,
      minPrice: req.priceRange.minPrice ?? 0,
      maxPrice: req.priceRange.maxPrice ?? 0,
      colors: req.availableColors,
    });
  },
);

module.exports = router;
