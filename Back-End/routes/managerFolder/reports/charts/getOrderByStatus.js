const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//get orders grouped by status according to the selected period
router.get("/ordersByStatus", (req, res) => {
  const { from, to } = req.query;
  const conditions = [];
  const values = [];
  let query = `select status, count(*) as orders from orders`;
  //filtering by start date
  if (from) {
    conditions.push("created_at >= ?");
    values.push(from);
  }
  //filtering by end date
  if (to) {
    conditions.push("created_at < date_add(?, interval 1 day)");
    values.push(to);
  }
  //adding filtering conditions if required
  if(conditions.length>0)
    query+=" where "+conditions.join(" and "); 
  query+=" group by status order by orders desc";
  db.query(query, values, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get orders by status",
      });
    return res.status(200).json({
      success: true,
      orders: results,
    });
  });
});

module.exports = router;
