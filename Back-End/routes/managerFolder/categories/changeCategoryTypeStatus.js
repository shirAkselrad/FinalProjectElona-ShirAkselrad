const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware changes category type status
const changeCategoryTypeStatus = (req, res) => {
  const { type_id, status } = req.body;
  if (!["Active", "Not Active"].includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });
  const query = "update category_types set status=? where type_id=?";
  db.query(query, [status, type_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update category type status",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "Category type not found",
      });
    return res.status(200).json({
      success: true,
      message: "Category type status updated successfully",
    });
  });
};

router.put("/changeCategoryTypeStatus", changeCategoryTypeStatus);

module.exports = router;
