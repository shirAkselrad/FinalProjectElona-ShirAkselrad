const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    const chars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return chars[char];
  });

const money = (value) => Number(value || 0).toFixed(2);
const points = (value) => Number(value || 0).toFixed(2);

const approvedOrderEmailTemplate = (order) => {
  const canceled = order.is_full_cancellation;

  const title = canceled
    ? "Your Order Has Been Canceled"
    : "Your Order Has Been Updated";

  const message = canceled
    ? "Your order has been successfully canceled."
    : "Your order changes have been approved. Below are your updated order details.";

  const items = order.items
    .filter((item) => item.status === "Active" || item.status === "Refunded")
    .map((item) => {
      const refunded = item.status === "Refunded";

      const style = refunded
        ? "color:#A89A96; text-decoration:line-through;"
        : "color:#4B1426;";

      return `
        <tr>
          <td style="padding:13px 8px; border-bottom:1px solid #E8D8D2;">
            <span style="${style}">
              ${escapeHtml(item.product_name)}
            </span>

            ${
              refunded
                ? `<p style="margin:5px 0 0; color:#B88C91;
                    font-size:10px; letter-spacing:1px;">
                    REFUNDED
                  </p>`
                : ""
            }
          </td>

          <td align="center"
            style="padding:13px 8px; border-bottom:1px solid #E8D8D2;">
            <span style="${style}">
              ${Number(item.quantity)}
            </span>
          </td>

          <td align="right"
            style="padding:13px 8px; border-bottom:1px solid #E8D8D2;">
            <span style="${style}">
              ${money(item.total_price)}₪
            </span>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
        <title>ELONA | Order Update</title>
      </head>

      <body style="margin:0; padding:0; background:#F6F0E9;">
        <table role="presentation" width="100%"
          cellpadding="0" cellspacing="0"
          style="background:#F6F0E9; font-family:Arial,sans-serif;">

          <tr>
            <td align="center" style="padding:35px 12px;">

              <table role="presentation" width="100%"
                cellpadding="0" cellspacing="0"
                style="max-width:560px; background:#FFFFFF;">

                <!-- Header -->
                <tr>
                  <td align="center"
                    style="background:#4B1426; padding:38px 20px;">

                    <h1 style="color:#F6F0E9;
                      font-family:Georgia,serif;
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

                <!-- Content -->
                <tr>
                  <td style="padding:35px 28px;">

                    <p align="center"
                      style="color:#B88C91; font-size:10px;
                      letter-spacing:3px; margin:0 0 16px;">
                      ORDER UPDATE
                    </p>

                    <h2 align="center"
                      style="color:#4B1426;
                      font-family:Georgia,serif;
                      font-size:24px; font-weight:400;
                      line-height:1.4; margin:0 0 12px;">
                      ${title}
                    </h2>

                    <p align="center"
                      style="color:#9C8581; font-size:11px;
                      letter-spacing:2px; margin:0 0 28px;">
                      ORDER #${escapeHtml(order.order_id)}
                    </p>

                    <p style="color:#51453E; font-size:14px;
                      line-height:1.8; margin:0 0 28px;">
                      ${message}
                    </p>

                    <!-- Products -->
                    <h3 style="color:#4B1426;
                      font-family:Georgia,serif;
                      font-size:19px; font-weight:400;
                      margin:0 0 15px;">
                      Order Items
                    </h3>

                    <table width="100%" cellpadding="0"
                      cellspacing="0"
                      style="font-size:12px; border-collapse:collapse;">

                      <tr style="background:#F6F0E9;">
                        <th align="left"
                          style="padding:12px 8px; color:#76503A;">
                          PRODUCT
                        </th>

                        <th align="center"
                          style="padding:12px 8px; color:#76503A;">
                          QTY
                        </th>

                        <th align="right"
                          style="padding:12px 8px; color:#76503A;">
                          TOTAL
                        </th>
                      </tr>

                      ${items}
                    </table>

                    <!-- Totals -->
                    <table width="100%" cellpadding="0"
                      cellspacing="0"
                      style="margin-top:30px; background:#F6F0E9;">

                      <tr>
                        <td align="center"
                          style="width:50%; padding:22px 10px;
                          border-right:1px solid #E8D8D2;">

                          <p style="color:#76503A;
                            font-size:10px; letter-spacing:1px;
                            margin:0 0 10px;">
                            ORIGINAL ORDER
                          </p>

                          <p style="color:#4B1426;
                            font-family:Georgia,serif;
                            font-size:22px; margin:0;">
                            ${money(order.original_total)}₪
                          </p>

                        </td>

                        <td align="center"
                          style="width:50%; padding:22px 10px;">

                          <p style="color:#76503A;
                            font-size:10px; letter-spacing:1px;
                            margin:0 0 10px;">
                            ${canceled ? "CANCELED ORDER" : "UPDATED ORDER"}
                          </p>

                          <p style="color:#4B1426;
                            font-family:Georgia,serif;
                            font-size:22px; margin:0;">
                            ${money(order.updated_total)}₪
                          </p>

                        </td>
                      </tr>
                    </table>

                    <!-- Loyalty points -->
                    <h3 style="color:#4B1426;
                      font-family:Georgia,serif;
                      font-size:19px; font-weight:400;
                      margin:30px 0 15px;">
                      Loyalty Points Summary
                    </h3>

                    <table width="100%" cellpadding="0"
                      cellspacing="0"
                      style="font-size:12px; color:#76503A;">

                      <tr>
                        <td style="padding:9px 0;">
                          Refund Points
                        </td>
                        <td align="right" style="padding:9px 0;">
                          +${points(order.refund_points)}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:9px 0;">
                          Returned Points
                        </td>
                        <td align="right" style="padding:9px 0;">
                          +${points(order.returned_points)}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:9px 0;">
                          Reversed Earned Points
                        </td>
                        <td align="right" style="padding:9px 0;">
                          -${points(order.reversed_earned_points)}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:16px 0;
                          border-top:1px solid #D8B8B5;
                          font-weight:bold; color:#4B1426;">
                          TOTAL POINTS CHANGE
                        </td>

                        <td align="right"
                          style="padding:16px 0;
                          border-top:1px solid #D8B8B5;
                          font-weight:bold; color:#4B1426;">
                          ${Number(order.total_points_change) >= 0 ? "+" : ""}${points(order.total_points_change)}
                        </td>
                      </tr>
                    </table>

                    <!-- Footer -->
                    <div style="border-top:1px solid #E8D8D2;
                      margin-top:25px;"></div>

                    <p align="center"
                      style="color:#51453E; font-size:13px;
                      margin:28px 0 12px;">
                      Thank you for choosing ELONA.
                    </p>

                    <p align="center"
                      style="color:#9A737A; font-size:10px;
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

module.exports = approvedOrderEmailTemplate;
