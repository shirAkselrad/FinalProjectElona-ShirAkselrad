import styles from "./orderPopupRowView.module.css";

/**
 * Displays a product belonging to the selected order
 * @param {Object} product current product of the order
 * @returns {JSX.Element}
 */
function OrderPopupRowView({ product }) {
  return (
    <div className={styles.row}>
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
