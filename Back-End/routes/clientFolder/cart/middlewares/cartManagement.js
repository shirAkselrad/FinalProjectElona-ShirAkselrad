const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware checks if the client already have an existing cart, if yes, saving the order id at req.cartOrderId else null
const checkExisitingCart = (req, res, next) => {
  const query = `select order_id from orders where client_email=? and status="PROCESSING" limit 1`;

  db.query(query, [req.session.user.email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't check client's cart",
      });
    }
    //saving cartOrderId if not found saving as null
    req.cartOrderId = results.length > 0 ? results[0].order_id : null;
    next();
  });
};

//this middleware creates new cart (new order) in case the client doesn't have already a cart
const createCartIfNeeded = (req, res, next) => {
  if (req.cartOrderId !== null) return next();

  //the shipping price
  const shipping = 0;

  const query = `insert into orders (client_email, total_items, total_price,shipping, final_price, status) values (?,0,0,?,?, 'PROCESSING')`;

  //staring the order with 30 shekels payment
  db.query(
    query,
    [req.session.user.email, shipping, shipping],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't create client's cart",
        });
      }
      //now saving the new order id
      req.cartOrderId = results.insertId;
      next();
    },
  );
};

//this middleware deletes an empty cart from the orders table
const deleteEmptyCart = (req, res, next) => {
  //checking if the cart is empty, if it does then deleting the cart
  if (Number(req.cartTotals.total_items) > 0) return next();
  const query =
    "delete from orders where order_id=? and client_email=? and status='PROCESSING'";
  db.query(query, [req.cartOrderId, req.session.user.email], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't delete empty cart",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    //there is no active cart so the order id is null
    req.cartOrderId = null;
    //saving that the cart has been deleted
    req.cartDeleted = true;
    next();
  });
};

//this middleware checks if the cart was deleted, if it was resting all the req details about it, else, continue
const checkIfCartDeleted = (req, res, next) => {
  if (req.cartDeleted) {
    return res.status(200).json({
      success: true,
      message: "Last product removed and empty cart deleted",
      total_items: 0,
      total_price: 0,
    });
  }
  next();
};

module.exports = {
  checkExisitingCart,
  createCartIfNeeded,
  deleteEmptyCart,
  checkIfCartDeleted,
};
