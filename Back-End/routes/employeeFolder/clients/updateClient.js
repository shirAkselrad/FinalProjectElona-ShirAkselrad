const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This path updates client details from the employee interface
router.put("/updateClient", (req, res) => {
  const {
    first_name,
    last_name,
    city,
    street,
    house_num,
    email,
    phone_num,
    status,
  } = req.body;

  const allowedStatuses = ["Active", "Inactive"];

  if (!allowedStatuses.includes(status))
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });

  const query = `
    update users
    set first_name=?, last_name=?, city=?, street=?,
        house_num=?, phone_num=?, status=?
    where email=? and role='Client'
  `;

  const values = [
    first_name,
    last_name,
    city,
    street,
    house_num,
    phone_num,
    status,
    email,
  ];

  db.query(query, values, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update client details",
      });

    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "Client not found or cannot be updated",
      });

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
    });
  });
});

module.exports = router;
