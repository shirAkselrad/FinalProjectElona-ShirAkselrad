const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//get monthly sales for the last 12 months
router.get("/salesChart", (req, res) => {
  const { from, to } = req.query;
  const values = [];
  //calculating the selected period
  let dateFormat = "%Y-%m";
  if (from && to) {
    const days = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);
    if (days <= 31) dateFormat = "%Y-%m-%d";
  }
  let query = `select date_format(created_at, '${dateFormat}') as month, round(sum(final_price),2) as sales from orders where status in('PAID','SHIPPED','COMPLETED')`;

  //filtering by start date
  if (from) {
    query += " and created_at >= ?";
    values.push(from);
  }


  //filtering by end date
  if (to) {
    query += " and created_at < date_add(?, interval 1 day)";
    values.push(to);
  }
  query += ` group by date_format(created_at, '${dateFormat}') order by month`;
  db.query(query, values, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get sales charts",
      });
    return res.status(200).json({
      success: true,
      sales: results,
    });
  });
});

module.exports = router;
