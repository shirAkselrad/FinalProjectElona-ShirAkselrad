const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();
const { transporter } = require("../../services/mailer");
const OrderConfirmation = require("../../services/emailTamplates/OrderConfirmation");

const sendOrderConfirmationEmail = async (order, items) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.client_email,
    subject: `ELONA | Order #${order.order_id} Confirmation`,
    html: OrderConfirmation(order, items),
  };

  return await transporter.sendMail(mailOptions);
};

const sendConfirmationInBackground = (order) => {
  const query =
    "select product_name, quantity, product_price, total_price from order_items where order_id=?";

  db.query(query, [order.order_id], async (err, items) => {
    if (err) {
      console.error("Couldn't get order items for email:", err);
      return;
    }

    try {
      await sendOrderConfirmationEmail(order, items);
      console.log("Order confirmation email sent:", order.order_id);
    } catch (error) {
      console.error("Couldn't send order confirmation email:", error);
    }
  });
};

const sendConfirmationEmail = (req, res, next) => {
  sendConfirmationInBackground(req.order);
  next();
};

module.exports = { sendConfirmationEmail };
