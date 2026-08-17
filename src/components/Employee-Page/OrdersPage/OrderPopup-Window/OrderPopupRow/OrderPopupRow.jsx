import styles from "./orderPopupRow.module.css";

function OrderPopupRow({ order }) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>{order.name}</span>
      <span>{order.quantity}</span>
      <span className={styles.price}>${order.price}</span>
      <span className={styles.total}>${order.price * order.quantity}</span>
    </div>
  );
}

export default OrderPopupRow;
