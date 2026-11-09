const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This path returns all the inventory details from back-end to front-end
router.get("/inventory", (req, res) => {
  const { category, type, status, stock, search } = req.query;
  let query = "select  * from inventory ";
  const params = [];
  let hasWhere = false;
  if (category && category !== "All Categories") {
    query += " where category=?";
    params.push(category);
    hasWhere = true;
  }

  if (type && type !== "All Types") {
    query += hasWhere ? " and type=?" : " where type=?";
    params.push(type);
    hasWhere = true;
  }
    if (status && status !== "All Statuses") {
      query += hasWhere ? " and status=?" : " where status=?";
      params.push(status);
      hasWhere = true;
    }

  if (stock === "Low Stock") {
    query += hasWhere ? " and " : " where ";
    query += "restock_required=1 and quantity> 0 and quantity<=min_stock";
    hasWhere = true;
  } else if (stock === "Out of Stock") {
    query += hasWhere ? " and " : " where ";
    query += "restock_required=1 and quantity=0";
    hasWhere = true;
  } else if (stock === "Normal Stock") {
    query += hasWhere ? " and " : " where ";
    query += "(restock_required !=1 or quantity>min_stock)";
    hasWhere = true;
  }
  if (search?.trim()) {
    const searchValue = `%${search.trim()}%`;

    query += hasWhere ? " and " : " where ";
    query += `(
    product_id like ? or
    name like ? or
    category like ? or
    type like ? or
    colors like ? or
    size like ? or
    status like ? or
    price like ?
  )`;

    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
    );
  }
  db.query(query, params, (err, results) => {
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
