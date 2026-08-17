import styles from "./orderPopupSumarry.module.css";

function OrderPopupSumarry({ total }) {
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

export default OrderPopupSumarry;
