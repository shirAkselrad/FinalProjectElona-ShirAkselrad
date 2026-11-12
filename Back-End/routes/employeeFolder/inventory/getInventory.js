const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();
const stockConditions = require("./stockConditions");

//This path returns all the inventory details from back-end to front-end
router.get("/inventory", (req, res) => {
  const { category, type, status, stock, search } = req.query;
  let query = "select  * from inventory ";
  const conditions = [];
  const params = [];

  if (category && category !== "All Categories") {
    conditions.push("category=?");
    params.push(category);
  }

  if (type && type !== "All Types") {
    conditions.push("type=?");
    params.push(type);
  }
  if (status && status !== "All Statuses") {
    conditions.push("status=?");
    params.push(status);
  }

  if (stock && stockConditions[stock])
    conditions.push(`(${stockConditions[stock]})`);

  if (search?.trim()) {
    const searchValue = `%${search.trim()}%`;

    conditions.push(`(
    product_id like ? or
    name like ? or
    category like ? or
    type like ? or
    colors like ? or
    size like ? or
    status like ? or
    price like ?
  )`);

    params.push(...Array(8).fill(searchValue));
  }

  if (conditions.length > 0) query += ` where ${conditions.join(" and ")}`;

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
