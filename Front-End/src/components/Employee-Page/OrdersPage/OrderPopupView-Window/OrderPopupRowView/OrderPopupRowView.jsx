import styles from "./orderPopupRowView.module.css";

function OrderPopupRowView({ product }) {
  return (
    <div
      className={`${styles.row} ${
        product.status === "Inactive" ? styles.inactive : ""
      }`}
    >
      <span>{product.product_id}</span>
      <span className={styles.name}>{product.product_name}</span>
      <span>{product.quantity}</span>
      <span className={styles.price}>
        ${Number(product.product_price).toFixed(2)}
      </span>
      <span className={styles.total}>
        ${Number(product.total_price).toFixed(2)}
      </span>
    </div>
  );
}

export default OrderPopupRowView;
