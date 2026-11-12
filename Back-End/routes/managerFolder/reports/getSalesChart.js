const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//get monthly sales for the last 12 months
router.get("/salesChart", (req, res) => {
  const query = `select date_format(created_at, '%Y-%m') as month,
                                  round(sum(final_price),2) as sales from orders
                        where status in('PAID','SHIPPED', 'COMPLETED') and created_at>=date_format(date_sub(curdate(), interval 11 month), '%Y-%m-01') 
                        group by date_format(created_at, '%Y-%m') order by month`;
  db.query(query, (err, results) => {
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
