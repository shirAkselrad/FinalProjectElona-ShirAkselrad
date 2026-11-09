const express = require("express");
const router = express.Router();

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

const { checkingRole } = require("../cart/middlewares/cartRole");

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

//tthis middleware responsible for updating the client's details after the changes in FE
const updateClientDetails = (req, res, next) => {
  const { first_name, last_name, city, street, house_num, phone_num } =
    req.body;
  const query = `
  update users
  set first_name=?, last_name=?, city=?,
      street=?, house_num=?, phone_num=?
  where email=?
`;
  db.query(
    query,
    [
      first_name,
      last_name,
      city,
      street,
      house_num,
      phone_num,
      req.session.user.email,
    ],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't update client's details",
        });
      if (results.affectedRows === 0)
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      next();
    },
  );
};

router.put(
  "/updateClientDetails",
  checkingRole, //checking that the user's role is "Client"
  updateClientDetails, //saving updated client's details after changing
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Clients details updated successfully",
    });
  },
);

module.exports = router;
