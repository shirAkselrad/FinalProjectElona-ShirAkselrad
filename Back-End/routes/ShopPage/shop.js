const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware returns the details of the active promotion
const getActivePromotion = (req, res) => {
  const query = `select name, discount_percentage, min_order_price, end_date from promotions_settings where status="Active" and start_date<=now() and end_date>now() limit 1`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get active promotion",
      });
    return res.status(200).json({
      success: true,
      promotion: results[0] || null,
    });
  });
};

const getCategories = (req, res, next) => {
  const query =
    "select category_id, name, status from categories where status='Active' and name in(select category from inventory where status='Active')";

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get categories",
      });

    req.categories = results;
    next();
  });
};

const getCategoryTypes = (req, res, next) => {
  const query =
    "select type_id, category_id, name, status from category_types where status='Active' and name in(select type from inventory where status='Active')";

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get category types",
      });

    req.categoryTypes = results;
    next();
  });
};

const getProducts = (req, res) => {
  const { category_id, type_id, search, sort, minPrice, maxPrice, colors } =
    req.query;
  let query = `select * from inventory where status='Active' and category in(
  select name from categories where status='Active') and type in(select name from category_types where status='Active')`;
  const values = [];
  if (category_id) {
    query += ` and category=(select name from categories where category_id=?)`;
    values.push(category_id);
  }
  if (search?.trim()) {
    query += " and name like ?";
    values.push(`%${search.trim()}%`);
  }
  if (type_id) {
    query += ` and type=(select name from category_types where type_id=?)`;
    values.push(type_id);
  }
  if (minPrice) {
    query += ` and price*(1-discount/100)>=?`;
    values.push(minPrice);
  }
  if (maxPrice) {
    query += ` and price*(1-discount/100) <=?`;
    values.push(maxPrice);
  }
  if (colors) {
    const selectedColors = colors.split(",");
    query += ` and (`;
    selectedColors.forEach((color, index) => {
      if (index > 0) query += " or ";
      query += "FIND_IN_SET(?, REPLACE(colors, ', ', ',')) > 0";
      values.push(color);
    });
    query += ")";
  }
  if (sort === "price_asc") query += ` order by price*(1-discount/100) asc`;
  else if (sort === "price_desc")
    query += ` order by price*(1-discount/100) desc`;
  db.query(query, values, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get products",
      });
    return res.status(200).json({
      success: true,
      products: results,
    });
  });
};

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
//this path returns the current active promotion
router.get("/getActivePromotion", getActivePromotion);

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

router.get("/getProducts", getProducts);

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

//this middleware send to FE all the products categories
router.get("/getCategories", getCategories, getCategoryTypes, (req, res) => {
  const categories = req.categories.map((category) => ({
    ...category,
    types: req.categoryTypes.filter(
      (type) => type.category_id === category.category_id,
    ),
  }));
  return res.status(200).json({
    success: true,
    categories,
  });
});
module.exports = router;
