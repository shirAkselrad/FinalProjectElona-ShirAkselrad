const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

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

router.get("/getProducts", getProducts);

module.exports = router;
