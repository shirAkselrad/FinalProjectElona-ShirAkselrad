const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();
const stockConditions = require("./stockConditions");

router.get("/inventory/filterOptions", (req, res) => {
  const query = `
    select distinct status
    from inventory
    where status is not null
    order by status
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Could not get filter options:", err);

      return res.status(500).json({
        success: false,
        message: "Couldn't get filter options",
      });
    }

    return res.status(200).json({
      success: true,
      statuses: results.map((item) => item.status),
      stocks: Object.keys(stockConditions),
    });
  });
});

module.exports = router;
