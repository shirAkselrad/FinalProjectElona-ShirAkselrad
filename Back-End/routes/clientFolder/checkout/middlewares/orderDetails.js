const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware gets the client's points and save them in req.clientPoints
const getClientsPoints = (req, res, next) => {
  const query = "select points from users where email=?";

  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get client points",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    req.clientPoints = Number(results[0].points) || 0;
    next();
  });
};

//this middleware saves the orderId of the order which it's status is PROCESSING
const checkProcessingOrder = (req, res, next) => {
  const query =
    "select order_id from orders where client_email=? and status='PROCESSING' limit 1";

  db.query(query, [req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get processing order",
      });

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        message: "Processing order not found",
      });

    req.cartOrderId = results[0].order_id;
    next();
  });
};

module.exports = {
  getClientsPoints,
  checkProcessingOrder,
};
