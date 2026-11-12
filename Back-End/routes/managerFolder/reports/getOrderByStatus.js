const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//get orders grouped by status for the last 12 months
router.get("/ordersByStatus", (req, res) => {
  const query = `select status, count(*) as orders from orders where created_at >= date_format(date_sub(curdate(), interval 11 month), '%Y-%m-01') group by status order by orders desc`;
  db.query(query, (err, results) => {
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

module.exports=router; 