//get all the paid cart items (product_id and quantity)
const getOrderItems = (req, res, next) => {
  const query = "select product_id, quantity from order_items where order_id=?";
  req.paymentDb.query(query, [req.orderId], (err, results) => {
    if (err) return next(err);
    if (results.length == 0) return next(new Error("Order items not found"));
    req.orderItems = results;
    next();
  });
};

const updateProductsStatus = (req, res, next) => {
  const query = `update inventory set status='Not Active' where restock_required=0 and quantity=0 and product_id in(select product_id from order_items where order_id=?)`;
  req.paymentDb.query(query, [req.orderId], (err) => {
    if (err) return next(err);
    next();
  });
};

//this middleware update the inventory after a successfull payment
const updateInventory = (req, res, next) => {
  const updateNextProduct = (index) => {
    if (index === req.orderItems.length) return next();

    const product = req.orderItems[index];
    const query =
      "update inventory set quantity=quantity-? where product_id=? and quantity>=?";
    req.paymentDb.query(
      query,
      [product.quantity, product.product_id, product.quantity],
      (err, result) => {
        if (err) return next(err);

        if (result.affectedRows !== 1)
          return next(new Error("Couldn't update inventory"));
        updateNextProduct(index + 1);
      },
    );
  };
  updateNextProduct(0);
};

module.exports = {
  getOrderItems,
  updateInventory,
  updateProductsStatus,
};
