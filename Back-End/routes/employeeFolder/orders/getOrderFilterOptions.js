const dbSingleton = require("../../../dbSingleton");
const getOrderFilterOptions = (req, res) => {
  const db = dbSingleton.getConnection();

  const query = `select distinct status from orders where status is not null order by status`;
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Error gettings order statuses",
      });
    return res.status(200).json({
      success: true,
      statuses: results.map((row) => row.status),
    });
  });
};

module.exports=getOrderFilterOptions; 