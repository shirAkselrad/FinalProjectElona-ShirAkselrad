const { transporter } = require("../../../../services/mailer");
const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

const approvedOrderEmailTemplate = require("./approvedOrderEmailTemplate");

const sendApprovedOrderEmail = (orderId, emailSummary) => {
  const query = `
    select order_item_id, product_name, quantity,
      total_price, status, replaces_order_item_id
    from order_items
    where order_id=?
      and status in ('Active', 'Refunded')
    order by order_item_id
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [orderId], async (err, items) => {
      if (err) return reject(err);

      try {
        const order = {
          order_id: orderId,
          ...emailSummary,
          items,
        };

        const canceled = order.is_full_cancellation;

        const subject = canceled
          ? `ELONA | Order #${orderId} Canceled`
          : `ELONA | Order #${orderId} Updated`;

        const message = canceled
          ? `Your order #${orderId} has been canceled.`
          : `Your order #${orderId} has been updated.`;

        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: order.client_email,
          subject,
          text: [
            message,
            `Original total: ${Number(order.original_total).toFixed(2)} ILS`,
            `Updated total: ${Number(order.updated_total).toFixed(2)} ILS`,
            `Total points change: ${Number(order.total_points_change).toFixed(2)}`,
          ].join("\n"),
          html: approvedOrderEmailTemplate(order),
        });

        console.log("Order update email sent:", orderId);
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports = sendApprovedOrderEmail;
