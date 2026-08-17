import styles from "./orderPopupTitle.module.css";

function OrderPopupTitle({ orderNumber, customerName, date }) {
  return (
    <div className={styles.orderPopupTitle}>
      <h2>Order #{orderNumber}</h2>

      <p>
        {customerName} · {date}
      </p>

      <div className={styles.decoration}>
        <span className={styles.line}></span>
        <span className={styles.diamond}></span>
        <span className={styles.line}></span>
      </div>
    </div>
  );
}

export default OrderPopupTitle;
