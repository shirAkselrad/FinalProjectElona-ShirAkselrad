import styles from "./alertsTitle.module.css";

function AlertsTitle({ text }) {
  return (
    <div className={styles.alertsTitle}>
      <span className={styles.marker}></span>

      <span className={styles.text}>{text}</span>

      <span className={styles.line}></span>
    </div>
  );
}

export default AlertsTitle;
