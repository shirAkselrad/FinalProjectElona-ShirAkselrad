const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

router.put("/updateDetails", (req, res) => {
  if (!req.session?.user?.email)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });

  const { first_name, last_name, phone_num, city, street, house_num } =
    req.body;
  const email = req.session.user.email;
  const query =
    "update users set first_name=?, last_name=?, phone_num=?, city=?, street=?, house_num=? where email=? and role='Client'";
  db.query(
    query,
    [first_name, last_name, phone_num, city, street, house_num, email],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update client details",
        });
      if (results.affectedRows === 0)
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });

      return res.status(200).json({
        success: true,
        message: "Client details updated successfully",
      });
    },
  );
});

router.get("/getDetails", (req, res) => {
  if (!req.session?.user?.email)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  const email = req.session.user.email;
  const query =
    "select first_name, last_name, phone_num, city, street, house_num from users where email=? and role='Client'";
  db.query(query, [email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get client details",
      });
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });

    return res.status(200).json({
      success: true,
      client: results[0],
    })
  });
});
module.exports = router;
