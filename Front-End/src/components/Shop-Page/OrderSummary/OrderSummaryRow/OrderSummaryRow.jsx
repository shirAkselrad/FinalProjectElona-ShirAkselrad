import styles from "./orderSummaryRow.module.css";

function OrderSummaryRow({ product }) {
  const originalPrice = Number(product.original_price);
  const discount = Number(product.discount);
  const salePrice = Number(product.product_price);
  const quantity = Number(product.quantity);
  const originalTotal = originalPrice * quantity;
  const finalTotal = Number(product.total_price);

  return (
    <tr className={styles.OrderSummaryRow}>
      <td>{product.product_id}</td>
      <td>{product.product_name}</td>
      <td>{originalPrice}₪</td>
      <td>{discount > 0 ? `${salePrice}₪` : "-"}</td>
      <td>{quantity}</td>
      <td>{originalTotal}₪</td>
      <td>{finalTotal}₪</td>
    </tr>
  );
}
export default OrderSummaryRow;
