import EmptyInput from "../../../General/EmptyInput/EmptyInput";
import styles from "./orderSummaryRow.module.css";

function OrderSummaryRow({ product, isEditable = false, onQuantityChange }) {
  const originalPrice = Number(product.original_price);
  const discount = Number(product.discount);
  const salePrice = Number(product.sale_price);
  const quantity = Number(product.quantity);
  const originalTotal = originalPrice * quantity;
  const finalTotal = isEditable
    ? salePrice * quantity
    : Number(product.total_price);

  return (
    <tr
      className={`${styles.OrderSummaryRow} ${
        product.status === "Inactive"
          ? styles.inactive
          : product.status === "Refunded"
            ? `${styles.inactive} ${styles.refunded}`
            : ""
      }`}
    >
      <td>{product.product_id}</td>
      <td>{product.product_name}</td>
      <td>{originalPrice}₪</td>
      <td>{discount > 0 ? `${salePrice}₪` : "-"}</td>

      <td>
        {isEditable && product.status === "Active" ? (
          <div className={styles.quantityInput}>
            <EmptyInput
              value={product.quantity}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                onQuantityChange(product.order_item_id, e.target.value)
              }
            />
          </div>
        ) : (
          quantity
        )}
      </td>
      <td>{originalTotal}₪</td>
      <td>{finalTotal}₪</td>
    </tr>
  );
}
export default OrderSummaryRow;
