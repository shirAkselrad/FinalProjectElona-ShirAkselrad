import styles from "./orderPopupRowView.module.css";

function OrderPopupRowView({ order }) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>{order.name}</span>
      <span>{order.quantity}</span>
      <span className={styles.price}>${order.price}</span>
      <span className={styles.total}>${order.price * order.quantity}</span>
    </div>
  );
}

export default OrderPopupRowView;
