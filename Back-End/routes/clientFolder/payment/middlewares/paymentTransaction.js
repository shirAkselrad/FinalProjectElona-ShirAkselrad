const dbSingleton = require("../../../../dbSingleton");

const beginPaymentTransaction = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err) return next(err);
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return next(err);
      }
      req.paymentDb = connection;
      next();
    });
  });
};

const commitPaymentTransaction = (req, res, next) => {
  req.paymentDb.commit((err) => {
    if (err) return next(err);
    req.paymentDb.release();
    req.paymentCommitted = true;
    req.paymentDb = null;
    next();
  });
};

const rollbackPaymentTransaction = (err, req, res, next) => {
  if (!req.paymentDb) return next(err);
  req.paymentDb.rollback(() => {
    req.paymentDb.release();
    req.paymentDb = null;
    next(err);
  });
};

module.exports = {
  beginPaymentTransaction,
  commitPaymentTransaction,
  rollbackPaymentTransaction,
};
