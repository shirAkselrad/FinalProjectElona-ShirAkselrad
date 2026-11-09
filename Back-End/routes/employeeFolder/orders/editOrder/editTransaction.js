const dbSingleton = require("../../../../dbSingleton");

// START TRANSACTION

const startEditTransaction = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Database error",
      });

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Transaction error",
        });
      }

      req.connection = connection;
      next();
    });
  });
};

// ROLLBACK

const rollbackEdit = (err, req, res) => {
  console.error("Order edit error:", err);

  req.connection.rollback(() => {
    req.connection.release();

    res.status(err.status || 500).json({
      success: false,
      message: err.status ? err.message : "Couldn't save order changes",
    });
  });
};

// COMMIT

const commitEdit = (req, res) => {
  req.connection.commit((err) => {
    if (err) return rollbackEdit(err, req, res);

    req.connection.release();

    res.status(200).json({
      success: true,
      message: "Order changes submitted for manager approval",
    });
  });
};

module.exports = {
  startEditTransaction,
  rollbackEdit,
  commitEdit,
};
