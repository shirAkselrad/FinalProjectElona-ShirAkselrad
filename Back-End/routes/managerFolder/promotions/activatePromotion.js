const express = require("express");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware checks if a promotion can be activated
const checkPromotionForActivation = (req, res, next) => {
  const { promotion_id } = req.body;
  const query = `select promotion_id from promotions_settings where promotion_id=? and start_date<= now() and end_date>now()`;
  db.query(query, [promotion_id], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't check promotion",
      });
    if (results.length === 0)
      return res.status(400).json({
        success: false,
        message: "Promotion doesn't exists or is outside its valid dates",
      });
    next();
  });
};

//transcation to promise the operation of deactivating unwanted promotion and activating a chosen promotion will happen together
const startTransaction = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get database connection",
      });
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't start transaction",
        });
      }
      req.dbConnection = connection;
      next();
    });
  });
};

//this middleware commits the transaction
const commitTransaction = (req, res, next) => {
  const connection = req.dbConnection;
  connection.commit((err) => {
    if (err) {
      return connection.rollback(() => {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't commit transaction",
        });
      });
    }
    connection.release();
    next();
  });
};

//this middleware deactivate the current active promotion
const deactivateCurrentPromotion = (req, res, next) => {
  const connection = req.dbConnection;
  const query = `update promotions_settings set status="Not Active" where status="Active"`;
  connection.query(query, (err) => {
    if (err) {
      return connection.rollback(() => {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't deactivate current promotions",
        });
      });
    }
    next();
  });
};

//this middlewarre activates a choosen promotion
const activatePromotion = (req, res, next) => {
  const { promotion_id } = req.body;
  const connection = req.dbConnection;
  const query = `update promotions_settings set status="Active" where promotion_id=?`;
  connection.query(query, [promotion_id], (err, results) => {
    if (err || results.affectedRows === 0) {
      return connection.rollback(() => {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't activate promotion",
        });
      });
    }
    next();
  });
};

router.put(
  "/activatePromotion",
  checkPromotionForActivation, //checking if the promotion is in a valid dates range for activating
  startTransaction, //opening a transaction
  deactivateCurrentPromotion, //deactivating the current active promotion
  activatePromotion, //activating the wanted promotion
  commitTransaction, //saving the changes and release the connection
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Promotion activated successfully",
    });
  },
);

module.exports = router;
