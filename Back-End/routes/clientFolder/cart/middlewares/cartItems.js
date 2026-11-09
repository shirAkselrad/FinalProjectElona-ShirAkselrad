const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware add exists product (which the requested amount changed) or new product to the order_items table (cart)
const addOrUpdateCartItem = (req, res, next) => {
  const product = req.product;
  const existingItem = req.existingCartItem;

  const quantity = Number(existingItem?.quantity || 0) + req.requestedQuantity;
  const price = Number(product.price);
  const discount = Number(product.discount) || 0;
  const salePrice = Number((price * (1 - discount / 100)).toFixed(2));
  const totalPrice = Number((salePrice * quantity).toFixed(2));
  let query, params;
  if (existingItem) {
    query = `update order_items set quantity=?, product_price=?, discount_percentage=?, discounted_product_price=?, total_price=? where order_id=? and product_id=?`;
    params = [
      quantity,
      price,
      discount,
      salePrice,
      totalPrice,
      req.cartOrderId,
      product.product_id,
    ];
  } else {
    query = `insert into order_items (order_id, product_id, product_name, quantity,product_price, discount_percentage,discounted_product_price, total_price) values (?,?,?,?,?,?,?,?)`;
    params = [
      req.cartOrderId,
      product.product_id,
      product.name,
      quantity,
      price,
      discount,
      salePrice,
      totalPrice,
    ];
  }
  db.query(query, params, (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't save cart item",
      });
    next();
  });
};

//this middleware gets all the items of req.cartOrderId
const getCartItems = (req, res, next) => {
  if (req.cartOrderId === null) {
    req.cartItems = [];
    return next();
  }

  const query = `
  select *,product_price as original_price,discount_percentage as discount,
         discounted_product_price as sale_price,
         (select path from files
          where files.product_id = order_items.product_id
          and file_number = 1 limit 1) as image
  from order_items
  where order_id=?
`;
  db.query(query, [req.cartOrderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't get cart items",
      });
    }

    req.cartItems = results;
    next();
  });
};

//this middleware update product's quantity in the cart and the total price of this product amount of pieces
const updateCartItemQuantity = (req, res, next) => {
  const quantity = req.requestedQuantity;
  const totalPrice = Number(
    (Number(req.cartItem.discounted_product_price) * quantity).toFixed(2),
  );
  const query = `update order_items set quantity=?, total_price=? where order_id=? and product_id=?`;

  db.query(
    query,
    [quantity, totalPrice, req.cartOrderId, req.product.product_id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update product quantity",
        });
      }

      next();
    },
  );
};

//this middleware removes a product from the cart
const removeCartItem = (req, res, next) => {
  const { product_id } = req.body;

  if (req.cartOrderId === null) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const query = "delete from order_items where order_id=? and product_id=?";

  db.query(query, [req.cartOrderId, product_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't remove product from cart",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    next();
  });
};

module.exports = {
  addOrUpdateCartItem,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
};
