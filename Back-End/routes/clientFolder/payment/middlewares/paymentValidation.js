const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

const checkUserLoggedIn = (req, res, next) => {
  if (!req?.session?.user?.email)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  next();
};

const getProcessingOrder = (req, res, next) => {
  const email = req.session.user.email;
  const query = `select * from orders where client_email=? and status="PROCESSING"`;
  db.query(query, [email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get order details",
      });
    if (results.length !== 1)
      return res.status(409).json({
        success: false,
        message: "Expected exactly one processing order",
      });
    req.order = results[0];
    next();
  });
};

const checkPayPalOrderId = (req, res, next) => {
  const { paypal_order_id } = req.body || {};
  if (typeof paypal_order_id !== "string" || !paypal_order_id.trim())
    return res.status(400).json({
      success: false,
      message: "PayPal order ID is required",
    });
  next();
};

module.exports = {
  checkUserLoggedIn,
  getProcessingOrder,
  checkPayPalOrderId,
};
