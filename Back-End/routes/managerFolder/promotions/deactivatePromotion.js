const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware deactivates a choosen promotion
const deactivatePromotion = (req, res, next) => {
  const { promotion_id } = req.body;
  const query = `update promotions_settings set status="Not Active" where promotion_id=?`;
  db.query(query, [promotion_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't deactivate promotion",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    next();
  });
};

router.put("/deactivatePromotion", deactivatePromotion, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Promotion deactivated successfully",
  });
});

module.exports = router;
