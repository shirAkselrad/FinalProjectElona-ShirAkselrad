const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

// Get current VAT percentage
router.get("/vatSettings", (req, res) => {
  const query = `
    select vat_percentage
    from vat_settings
    where vat_id=1
  `;

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get VAT settings",
      });

    if (!results.length)
      return res.status(404).json({
        success: false,
        message: "VAT settings not found",
      });

    return res.status(200).json({
      success: true,
      vat_percentage: results[0].vat_percentage,
    });
  });
});

module.exports = router;
