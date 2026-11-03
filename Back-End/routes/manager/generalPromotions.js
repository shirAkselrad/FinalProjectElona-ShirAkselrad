const express = require("express");
const router = express.Router();
const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets all promotions
const getPromotions = (req, res) => {
  const query = "select * from promotions_settings";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get promotions",
      });
    return res.status(200).json({
      success: true,
      promotions: results,
    });
  });
};

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

//this middleware creates a new promotion
const createPromotion = (req, res, next) => {
  const { name, discount_percentage, min_order_price, start_date, end_date } =
    req.body;
  const query = `insert into promotions_settings (name, discount_percentage, min_order_price, start_date, end_date, status) values (?, ?, ?, ?, ?, 'Not Active')`;
  db.query(
    query,
    [name, discount_percentage, min_order_price, start_date, end_date],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Couldn't add new promotion",
        });
      req.promotion_id = results.insertId;
      next();
    },
  );
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

//this middleware deactivates expired promotions
const deactivateExpiredPromotion = (req, res, next) => {
  const query =
    "update promotions_settings set status='Not Active' where status='Active' and end_date<=now()";
  db.query(query, (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't update expired promotions",
      });
    next();
  });
};

router.get("/getGeneralPromotions", deactivateExpiredPromotion, getPromotions);

router.post("/createPromotion", createPromotion, (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Promotion has been created successfully",
    promotion_id: req.promotion_id,
  });
});

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

router.put("/deactivatePromotion", deactivatePromotion, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Promotion deactivated successfully",
  });
});
module.exports = router;
