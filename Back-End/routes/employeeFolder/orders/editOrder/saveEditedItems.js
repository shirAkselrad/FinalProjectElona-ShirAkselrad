const { rollbackEdit } = require("./editTransaction");

// SAVE EDITED ITEMS

const saveEditedItems = (req, res, next) => {
  const items = req.originalItems;
  let index = 0;

  const saveNext = () => {
    if (index === items.length) return next();

    const item = items[index++];

    const updateQuery = `update order_items
      set status='Inactive'
      where order_item_id=? and order_id=? and status='Active'`;

    req.connection.query(
      updateQuery,
      [item.order_item_id, req.params.order_id],
      (err, result) => {
        if (err) return rollbackEdit(err, req, res);

        if (result.affectedRows !== 1)
          return rollbackEdit(
            new Error("Couldn't update original item"),
            req,
            res,
          );
        if (item.newQuantity === 0) return saveNext();

        const insertQuery = `insert into order_items
          (order_id, product_id, product_name, quantity,
           discounted_product_price, total_price,
           discount_percentage, product_price,
           status, replaces_order_item_id)
          values (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)`;

        const newTotal = Number(
          (Number(item.discounted_product_price) * item.newQuantity).toFixed(2),
        );

        req.connection.query(
          insertQuery,
          [
            req.params.order_id,
            item.product_id,
            item.product_name,
            item.newQuantity,
            item.discounted_product_price,
            newTotal,
            item.discount_percentage,
            item.product_price,
            item.order_item_id,
          ],
          (err) => {
            if (err) return rollbackEdit(err, req, res);
            saveNext();
          },
        );
      },
    );
  };

  saveNext();
};

module.exports = saveEditedItems;
