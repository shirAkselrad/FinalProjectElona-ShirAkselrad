const OrderStatusTemplate = (order) => {
  const content = {
    SHIPPED: {
      icon: "✦",
      title: "Your Order Is On Its Way!",
      message: "Your order has been shipped!",
      details:
        "Your delivery will arrive within 5 business days. The courier will contact you shortly before arrival.",
    },
    COMPLETED: {
      icon: "♡",
      title: "Thank You for Shopping with ELONA!",
      message: "Your order has been completed!",
      details:
        "We would love to hear about your shopping experience on our website.",
    },
    CANCELED: {
      icon: "✦",
      title: "Your Order Has Been Canceled",
      message: "Your order has been successfully canceled.",
      details: "We hope to welcome you back soon.",
    },
  };

  const details = content[order.status];
  if (!details) return "";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ELONA | Order Update</title>
      </head>

      <body style="margin:0; padding:0; background-color:#F6F0E9;">
        <table role="presentation" width="100%" cellpadding="0"
          cellspacing="0" border="0"
          style="background-color:#F6F0E9; font-family:Arial,sans-serif;">
          <tr>
            <td align="center" style="padding:35px 12px;">

              <table role="presentation" width="100%" cellpadding="0"
                cellspacing="0" border="0"
                style="max-width:560px; background-color:#FFFFFF;">

                <tr>
                  <td align="center" bgcolor="#4B1426"
                    style="background-color:#4B1426; padding:38px 20px;">

                    <h1 style="color:#F6F0E9; font-family:Georgia,serif;
                      font-size:36px; font-weight:400;
                      letter-spacing:7px; margin:0;">
                      ELONA
                    </h1>

                    <p style="color:#E8C4A3; font-size:10px;
                      letter-spacing:2px; line-height:1.8;
                      margin:12px 0 0;">
                      EXCLUSIVE FASHION FOR STRONG WOMEN
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:40px 30px;">

                    <p style="color:#B88C91; font-size:10px;
                      letter-spacing:3px; margin:0 0 20px;">
                      ORDER UPDATE
                    </p>

                    <p style="color:#B88C91; font-size:30px;
                      margin:0 0 18px;">
                      ${details.icon}
                    </p>

                    <h2 style="color:#4B1426; font-family:Georgia,serif;
                      font-size:24px; font-weight:400;
                      line-height:1.4; margin:0 0 12px;">
                      ${details.title}
                    </h2>

                    <p style="color:#9C8581; font-size:11px;
                      letter-spacing:2px; margin:0 0 30px;">
                      ORDER #${order.order_id}
                    </p>

                    <div style="border-top:1px solid #E8D8D2;"></div>

                    <p style="color:#51453E; font-size:15px;
                      line-height:1.8; margin:30px 0 15px;">
                      ${details.message}
                    </p>

                    ${
                      order.status === "CANCELED"
                        ? `
                      <table role="presentation" width="100%"
                        cellpadding="0" cellspacing="0" border="0"
                        style="margin:20px 0 25px; background-color:#F6F0E9;">
                        <tr>
                          <td align="center" style="padding:25px 15px;">

                            <p style="color:#76503A; font-size:10px;
                              letter-spacing:2px; margin:0 0 12px;">
                              POINTS CREDITED TO YOUR ACCOUNT
                            </p>

                            <p style="color:#4B1426;
                              font-family:Georgia,serif;
                              font-size:34px; margin:0 0 8px;">
                              ${order.final_price}
                            </p>

                            <p style="color:#76503A; font-size:12px;
                              margin:0;">
                              ELONA Points
                            </p>

                          </td>
                        </tr>
                      </table>
                    `
                        : ""
                    }

                    <p style="color:#76503A; font-size:14px;
                      line-height:1.9; margin:15px 0 30px;">
                      ${details.details}
                    </p>

                    ${
                      order.status === "COMPLETED"
                        ? `
                      <table role="presentation" cellpadding="0"
                        cellspacing="0" border="0"
                        style="margin:0 auto 35px;">
                        <tr>
                          <td align="center" bgcolor="#4B1426"
                            style="padding:15px 30px;">
                            <a href="${process.env.FRONTEND_URL}/orderReview?order_id=${order.order_id}"
                              style="color:#F6F0E9; text-decoration:none;
                                font-size:11px; letter-spacing:2px;
                                font-family:Arial,sans-serif;">
                              RATE YOUR EXPERIENCE
                            </a>
                          </td>
                        </tr>
                      </table>
                    `
                        : ""
                    }

                    <div style="border-top:1px solid #E8D8D2; width:100%;"></div>

                    <p style="color:#51453E; font-size:13px;
                      margin:28px 0 12px;">
                      Thank you for choosing ELONA.
                    </p>

                    <p style="color:#9A737A; font-size:10px;
                      letter-spacing:2px; line-height:1.8; margin:0;">
                      WITH LOVE, THE ELONA TEAM
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

module.exports = OrderStatusTemplate;
