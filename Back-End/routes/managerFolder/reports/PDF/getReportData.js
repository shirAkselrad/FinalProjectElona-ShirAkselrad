const dbSingleton = require("../../../../dbSingleton")
const db = dbSingleton.getConnection();

function getReportData(type, from, to) {
  return new Promise((resolve, reject) => {
    let query;
    let params = [];

    switch (type) {
      case "users":
        query = `
          select
            first_name, last_name, email, username,
            phone_num, city, role, status, points
          from users
          order by last_name, first_name
        `;
        break;

      case "inventory":
        query = `
          select
            product_id, name, category, type,
            colors, size, price, discount,
            quantity, min_stock, status, creation_date
          from inventory
          where creation_date >= ?
            and creation_date < date_add(?, interval 1 day)
          order by creation_date desc
        `;
        params = [from, to];
        break;

      case "orders":
        query = `
          select
            order_id, client_email, total_items,
            total_price, shipping, points_used,
            final_price, status, created_at
          from orders
          where created_at >= ?
            and created_at < date_add(?, interval 1 day)
          order by created_at desc
        `;
        params = [from, to];
        break;

      default:
        return reject(new Error("Invalid report type"));
    }

    db.query(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = getReportData;
