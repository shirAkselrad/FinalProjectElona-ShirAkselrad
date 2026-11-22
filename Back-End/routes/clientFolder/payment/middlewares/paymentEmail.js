const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();
const { transporter } = require("../../../../services/mailer");
const OrderConfirmation = require("../../../../services/emailTamplates/OrderConfirmation");

//sending the order confirmation email
const sendOrderConfirmationEmail = async (order, items) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.client_email,
    subject: `ELONA | Order #${order.order_id} Confirmation`,
    html: OrderConfirmation(order, items),
  };

  return await transporter.sendMail(mailOptions);
};

//getting the purchased products
const getOrderItems = (orderId, callback) => {
  const query = `
    select product_name, quantity, product_price, total_price
    from order_items
    where order_id=?
  `;

  db.query(query, [orderId], (err, results) => {
    console.log("Email order ID:", orderId);
    console.log("Email order items:", results);

    callback(err, results);
  });
};

//getting the order details, points and delivery dates
const getOrderDetails = (orderId, callback) => {
  const query = `select order_id, client_email, shipping,final_price, points_used, points_earned, min_delivery_date, max_delivery_date from orders where order_id=? and status='PAID'`;
  db.query(query, [orderId], callback);
};

//getting the client's current points
const getClientPoints = (email, callback) => {
  const query = `select points from users where email=?`;
  db.query(query, [email], callback);
};

//sending the confirmation email without blocking the response
const sendConfirmationInBackground = (order) => {
  if (!order?.order_id || !order?.client_email) {
    console.error("Missing order details for confirmation email");
    return;
  }

  getOrderItems(order.order_id, (itemsError, items) => {
    if (itemsError) {
      console.error("Couldn't get order items for email:", itemsError);
      return;
    }
    console.log("Order items for email:", items);

    getOrderDetails(order.order_id, (detailsError, results) => {
      if (detailsError || !results?.length) {
        console.error(
          "Couldn't get order details for email:",
          detailsError || "Order not found",
        );
        return;
      }

      const details = results[0];

      getClientPoints(details.client_email, async (pointsError, users) => {
        if (pointsError || !users?.length) {
          console.error(
            "Couldn't get client's points:",
            pointsError || "Client not found",
          );
          return;
        }

        const pointsUsed = Number(details.points_used || 0);
        const pointsEarned = Number(details.points_earned || 0);
        const totalPoints = Number(users[0].points || 0);

        const updatedOrder = {
          ...order,
          ...details,
          points_used: pointsUsed,
          points_earned: pointsEarned,
          points_before: totalPoints + pointsUsed - pointsEarned,
          total_points: totalPoints,
        };

        try {
          await sendOrderConfirmationEmail(updatedOrder, items);
          console.log("Order confirmation email sent:", order.order_id);
        } catch (error) {
          console.error("Couldn't send order confirmation email:", error);
        }
      });
    });
  });
};

const sendConfirmationEmail = (req, res, next) => {
  sendConfirmationInBackground(req.order);
  next();
};

module.exports = { sendConfirmationEmail };
