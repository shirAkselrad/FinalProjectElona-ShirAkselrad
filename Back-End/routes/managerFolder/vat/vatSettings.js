const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//get VAT settings
router.get("/vatSettings", (req, res) => {
  const query = `select vat_percentage from vat_settings where vat_id=1`;
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
      settings: results[0],
    });
  });
});

//update VAT settings
router.put("/updateVatSettings", (req, res) => {
  const { vat_percentage } = req.body;
  const percentage = Number(vat_percentage);
  //checking that the value is valid 
  if (
    vat_percentage === "" ||
    vat_percentage == null ||
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > 100 ||
    Math.round(percentage * 100) / 100 !== percentage
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid VAT percentage",
    });
  }

  const query = `update vat_settings set vat_percentage=? where vat_id=1`;
  db.query(query, [Number(vat_percentage)], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update VAT settings",
      });
    if (results.affectedRows !== 1)
      return res.status(404).json({
        success: false,
        message: "VAT settings not found",
      });
    return res.status(200).json({
      success: true,
      message: "VAT settings updated successfully!",
    });
  });
});

module.exports = router;
