const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

const { checkingRole } = require("../ShopPage/cartMiddleware");

//this middleware gets all the clients details (first and last namae, address and contact addresses)
const getClientDetails = (req, res, next) => {
  const query =
    "select first_name, last_name,city, street, house_num, phone_num, email from users where email=?";
  db.query(query, [req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get client's details",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    req.clientDetails = results[0];
    next();
  });
};

router.get("/getClientDetails", checkingRole, getClientDetails, (req, res) => {
  return res.status(200).json({
    success: true,
    client: req.clientDetails,
  });
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
