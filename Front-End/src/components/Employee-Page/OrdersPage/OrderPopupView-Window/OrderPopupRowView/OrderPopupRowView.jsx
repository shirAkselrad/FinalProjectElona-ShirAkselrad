import styles from "./orderPopupRowView.module.css";

/**
 *
 * @param {product} current product of the order which viewed right now
 * @returns  OrderPopupRowView
 */
function OrderPopupRowView({ product }) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>{product.name}</span>
      <span>{product.quantity}</span>
      <span className={styles.price}>${product.price}</span>
      <span className={styles.total}>${product.price * product.quantity}</span>
    </div>
  );
}

export default OrderPopupRowView;
