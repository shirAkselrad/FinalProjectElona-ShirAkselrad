const escapeHtml = (value) => {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return characters[char];
  });
};

const formatPrice = (value) => {
  return `₪${Number(value || 0).toFixed(2)}`;
};

const formatPoints = (value) => {
  return Number(value).toFixed(2);
};

const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

// Creates the order confirmation email
function OrderConfirmation(order, items) {
  const productsRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 6px; border-bottom:1px solid #e8d7d2; color:#4b1426;">
            ${escapeHtml(item.product_name)}
          </td>

          <td style="padding:12px 6px; border-bottom:1px solid #e8d7d2; text-align:center;">
            ${Number(item.quantity)}
          </td>

          <td style="padding:12px 6px; border-bottom:1px solid #e8d7d2; text-align:right; white-space:nowrap;">
            ${formatPrice(item.total_price)}
          </td>
        </tr>
      `,
    )
    .join("");

  const minDelivery = formatDate(order.min_delivery_date);
  const maxDelivery = formatDate(order.max_delivery_date);

  const hasDelivery = minDelivery && maxDelivery;

  const hasPoints = [
    order.points_before,
    order.points_used,
    order.points_earned,
    order.total_points,
  ].every((value) => value != null && Number.isFinite(Number(value)));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ELONA Order Confirmation</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f6f0e9; font-family:Georgia,serif; color:#4b1426;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f0e9;">
        <tr>
          <td align="center" style="padding:30px 12px;">

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#fffdfb; border:1px solid #e8d7d2;">

              <!-- HEADER -->
              <tr>
                <td align="center" style="padding:35px 25px 25px;">

                  <h1 style="margin:0; font-size:38px; font-weight:normal; letter-spacing:5px; color:#4b1426;">
                    ELONA
                  </h1>

                  <p style="margin:10px 0 0; font-family:Arial,sans-serif; font-size:10px; letter-spacing:2px; color:#ad7949;">
                    EXCLUSIVE FASHION FOR STRONG WOMEN
                  </p>

                </td>
              </tr>

              <!-- INTRODUCTION -->
              <tr>
                <td align="center" style="padding:20px 25px; border-top:1px solid #d8afa6;">

                  <h2 style="margin:0 0 12px; font-size:25px; font-weight:normal; color:#4b1426;">
                    Thank You for Your Order
                  </h2>

                  <p style="font-family:Arial,sans-serif; font-size:13px; line-height:1.8; color:#765563;">
                    Your payment was completed successfully.
                    We're delighted you chose ELONA.
                  </p>

                  <p style="font-family:Arial,sans-serif; font-size:12px; letter-spacing:1px; color:#987b76;">
                    ORDER #${escapeHtml(order.order_id)}
                  </p>

                </td>
              </tr>

              <!-- ORDER DETAILS -->
              <tr>
                <td style="padding:15px 30px;">

                  <h3 style="margin:0 0 18px; font-size:20px; font-weight:normal; color:#4b1426;">
                    Order Summary
                  </h3>

                  <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif; font-size:12px; color:#765563; border-collapse:collapse;">

                    <thead>
                      <tr style="background-color:#f6f0e9;">
                        <th style="padding:12px 6px; text-align:left; color:#4b1426;">PRODUCT</th>
                        <th style="padding:12px 6px; text-align:center; color:#4b1426;">QTY</th>
                        <th style="padding:12px 6px; text-align:right; color:#4b1426;">TOTAL</th>
                      </tr>
                    </thead>

                    <tbody>
                      ${productsRows}
                    </tbody>

                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px; font-family:Arial,sans-serif; font-size:13px; color:#765563;">

                    <tr>
                      <td style="padding:8px 0;">Shipping</td>
                      <td align="right">${formatPrice(order.shipping)}</td>
                    </tr>

                    <tr>
                      <td colspan="2" style="padding-top:12px; border-bottom:1px solid #d8afa6;"></td>
                    </tr>

                    <tr>
                      <td style="padding:18px 0; font-size:16px; font-weight:bold; color:#4b1426;">
                        TOTAL PAID
                      </td>
                      <td align="right" style="font-size:20px; font-weight:bold; color:#4b1426;">
                        ${formatPrice(order.final_price)}
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>

              ${
                hasDelivery
                  ? `
                  <!-- DELIVERY -->
                  <tr>
                    <td style="padding:24px 30px; border-top:1px solid #e8d7d2;">

                      <h3 style="margin:0 0 12px; font-size:20px; font-weight:normal; color:#4b1426;">
                        Estimated Delivery
                      </h3>

                      <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; line-height:1.7; color:#765563;">
                        ${minDelivery} – ${maxDelivery}
                      </p>

                    </td>
                  </tr>
                  `
                  : ""
              }

              ${
                hasPoints
                  ? `
                  <!-- LOYALTY POINTS -->
                  <tr>
                    <td style="padding:25px 30px; border-top:1px solid #e8d7d2;">

                      <h3 style="margin:0 0 20px; font-size:20px; font-weight:normal; color:#4b1426;">
                        Your Loyalty Points
                      </h3>

                      <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif; font-size:13px; color:#765563;">

                        <tr>
                          <td style="padding:8px 0;">Points Before Purchase</td>
                          <td align="right">${formatPoints(order.points_before)}</td>
                        </tr>

                        <tr>
                          <td style="padding:8px 0;">Points Redeemed</td>
                          <td align="right">−${formatPoints(order.points_used)}</td>
                        </tr>

                        <tr>
                          <td style="padding:8px 0;">Points Earned</td>
                          <td align="right">+${formatPoints(order.points_earned)}</td>
                        </tr>

                        <tr>
                          <td colspan="2" style="padding-top:12px; border-bottom:1px solid #d8afa6;"></td>
                        </tr>

                        <tr>
                          <td style="padding:18px 0 5px; font-weight:bold; color:#4b1426;">
                            CURRENT POINTS BALANCE
                          </td>
                          <td align="right" style="padding:18px 0 5px; font-size:20px; font-weight:bold; color:#4b1426;">
                            ${formatPoints(order.total_points)}
                          </td>
                        </tr>

                      </table>

                    </td>
                  </tr>
                  `
                  : ""
              }

              <!-- FOOTER -->
              <tr>
                <td align="center" style="padding:30px 20px; background-color:#f6f0e9; border-top:1px solid #e8d7d2;">

                  <p style="margin:0 0 10px; font-size:16px; color:#4b1426;">
                    Thank you for shopping with ELONA.
                  </p>

                  <p style="margin:0; font-family:Arial,sans-serif; font-size:11px; color:#987b76;">
                    Exclusive fashion for strong women.
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
}

module.exports = OrderConfirmation;
