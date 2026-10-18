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
        "Thank you for shopping with us! We would love to hear about your shopping experience on our website.",
    },
    CANCELED: {
      icon: "✦",
      title: "Your Order Has Been Canceled",
      message: "Your order has been successfully canceled.",
      details: "We hope to see you again soon!",
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
        <title>ELONA Order Update</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f7f3ee;">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color:#f7f3ee; font-family:Arial,sans-serif;"
        >
          <tr>
            <td align="center" style="padding:20px 10px;">

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="max-width:560px; background-color:#ffffff;"
              >
                <tr>
                  <td align="center" style="padding:30px 20px; text-align:center;">

                    <h1 style="
                      color:#49372f;
                      font-size:34px;
                      font-weight:400;
                      letter-spacing:5px;
                      margin:0;
                    ">
                      ELONA
                    </h1>

                    <p style="
                      color:#9a806d;
                      font-size:10px;
                      letter-spacing:3px;
                      margin:10px 0 30px;
                    ">
                      TIMELESS ELEGANCE
                    </p>

                    <div style="border-top:1px solid #d9c8b8;"></div>

                    <p style="
                      color:#a48770;
                      font-size:36px;
                      margin:35px 0 15px;
                    ">
                      ${details.icon}
                    </p>

                    <h2 style="
                      color:#49372f;
                      font-size:23px;
                      font-weight:400;
                      line-height:1.4;
                      margin:0 0 15px;
                    ">
                      ${details.title}
                    </h2>

                    <p style="
                      color:#8c7565;
                      font-size:12px;
                      letter-spacing:2px;
                      margin:0 0 35px;
                    ">
                      ORDER #${order.order_id}
                    </p>

                    <p style="
                      color:#554940;
                      font-size:16px;
                      line-height:1.7;
                      margin:0 0 20px;
                    ">
                      ${details.message}
                    </p>

                    <p style="
                      color:#554940;
                      font-size:14px;
                      line-height:1.9;
                      margin:0 0 40px;
                    ">
                      ${details.details}
                    </p>

                    <div style="border-top:1px solid #e9ded4;"></div>

                    <p style="
                      color:#8c7565;
                      font-size:13px;
                      margin:25px 0 15px;
                    ">
                      Thank you for choosing ELONA.
                    </p>

                    <p style="
                      color:#a48770;
                      font-size:10px;
                      letter-spacing:2px;
                      line-height:1.8;
                      margin:0;
                    ">
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
