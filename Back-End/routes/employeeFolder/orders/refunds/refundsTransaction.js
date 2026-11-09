const dbSingleton = require("../../../../dbSingleton");

const startRefund = (req, res, next) => {
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
          message: "Couldn't start refund",
        });
      }
      req.connection = connection;
      next();
    });
  });
};

const completeRefund = (req, res, next) => {
  req.connection.commit((err) => {
    if (err) return refundError(req, res);
    req.connection.release();
    next();
  });
};

const refundError = (
  req,
  res,
  status = 500,
  message = "Couldn't refund points",
) => {
  req.connection.rollback(() => {
    req.connection.release();
    return res.status(status).json({
      success: false,
      message,
    });
  });
};

module.exports = {
  startRefund,
  completeRefund,
  refundError,
};
