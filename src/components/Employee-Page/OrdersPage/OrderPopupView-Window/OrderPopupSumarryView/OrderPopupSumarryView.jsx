import styles from "./orderPopupSumarryView.module.css";

/**
 *
 * @param {total} total price for all the current order
 * @returns
 */
function OrderPopupSumarryView({ total }) {
  return (
    <div className={styles.orderPopupSumarry}>
      <div className={styles.line}></div>

      <div className={styles.summary}>
        <span className={styles.label}>ORDER TOTAL</span>
        <span className={styles.total}>${total}</span>
      </div>
    </div>
  );
}

export default OrderPopupSumarryView;
