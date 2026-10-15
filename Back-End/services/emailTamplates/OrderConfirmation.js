// This component creates the HTML content for the order confirmation email
function OrderConfirmation(order, items) {
  // Creating an HTML row for each product in the order
  const productsRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${escapeHtml(item.product_name)}
          </td>

          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${Number(item.quantity)}
          </td>

          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ₪${Number(item.product_price).toFixed(2)}
          </td>

          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ₪${Number(item.total_price).toFixed(2)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="background-color: #faf8f6; padding: 30px; font-family: Arial, sans-serif; color: #3d302b;">

      <div style="max-width: 650px; margin: auto; background-color: #ffffff; padding: 30px; border: 1px solid #eee5de;">

        <h1 style="text-align: center; color: #654b3d; letter-spacing: 4px;">
          ELONA
        </h1>

        <p style="text-align: center; color: #947e70;">
          ORDER CONFIRMATION
        </p>

        <hr style="border: none; border-top: 1px solid #eee5de;">

        <h2>Thank you for your purchase!</h2>

        <p>
          Your payment was completed successfully.
          We're happy you chose ELONA!
        </p>

        <p><strong>Order Number:</strong> #${order.order_id}</p>

        <h3 style="margin-top: 30px; color: #654b3d;">
          Order Summary
        </h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f7f2ed;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>

          <tbody>
            ${productsRows}
          </tbody>
        </table>

        <div style="margin-top: 25px; text-align: right;">
          <p>
            Shipping: ₪${Number(order.shipping).toFixed(2)}
          </p>

          <h2 style="color: #654b3d;">
            Total Paid: ₪${Number(order.final_price).toFixed(2)}
          </h2>
        </div>

        <hr style="border: none; border-top: 1px solid #eee5de; margin-top: 30px;">

        <p style="text-align: center; color: #947e70; font-size: 13px;">
          Thank you for shopping with ELONA!
        </p>

      </div>
    </div>
  `;
}

// Prevents text from being interpreted as HTML
function escapeHtml(value) {
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
}

module.exports = OrderConfirmation;
