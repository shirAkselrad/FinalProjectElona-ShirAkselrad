const { transporter } = require("../../../services/mailer");
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();
const orderStatusTemplate= require("./orderStatusTemplate")


const sendOrderStatusEmail = async (order) => {
  const emailContent = {
    SHIPPED: {
      subject: `ELONA | Order #${order.order_id} Shipped`,
      message:
        "Your order has been shipped! Your delivery will arrive within 5 business days. The courier will contact you shortly before arrival.",
    },
    COMPLETED: {
      subject: `ELONA | Order #${order.order_id} Completed`,
      message:
        "Thank you for shopping with ELONA! We would love to hear about your shopping experience on our website.",
    },
    CANCELED: {
      subject: `ELONA | Order #${order.order_id} Canceled`,
      message:
        "Your order has been successfully canceled. We hope to see you again soon!",
    },
  };

  const content = emailContent[order.status];
  if (!content) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.client_email,
    subject: content.subject,
    text: content.message,
    html: orderStatusTemplate(order),
  };

  return await transporter.sendMail(mailOptions);
};


const sendStatusEmail = (req, res, next) => {
  const { order_id } = req.params;
  const { status } = req.body;
  const query = "select client_email from orders where order_id=?";

  db.query(query, [order_id], (err, results) => {
    if (err) {
      console.error("Couldn't get client's email address: ", err);
      return next();
    }
  if (results.length > 0) {
    const order = {
      order_id,
      status,
      client_email: results[0].client_email,
    };

    console.log("Sending status email:", order);

   sendOrderStatusEmail(order)
     .then((info) => {
       console.log("Email status:", order.status);
       console.log("Accepted:", info.accepted);
       console.log("Rejected:", info.rejected);
       console.log("Message ID:", info.messageId);
     })
     .catch((error) => {
       console.error("Couldn't send order status email:", error);
     });
  }
    next();
  });
};
module.exports = { sendStatusEmail };
