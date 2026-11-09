const dbSingleton = require("../../../../dbSingleton");

const beginEditTransaction = (req, res, next) => {
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
          message: "Couldn't start product update",
        });
      }
      req.dbConnection = connection;
      next();
    });
  });
};

const editError = (req, res, status, message) => {
  req.dbConnection.rollback(() => {
    req.dbConnection.release();
    return res.status(status).json({
      success: false,
      message,
    });
  });
};

const commitEditTransaction = (req, res) => {
  req.dbConnection.commit((err) => {
    if (err)
      return editError(req, res, 500, "Couldn't complete product update");
    req.dbConnection.release();
    return res.status(200).json({
      success: true,
      message: "Product was updated successfully!",
    });
  });
};

module.exports = {
  beginEditTransaction,
  editError,
  commitEditTransaction,
};
