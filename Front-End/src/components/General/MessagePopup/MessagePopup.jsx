import styles from "./messagePopup.module.css";

function MessagePopup({ message, type = "success", onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles[type]}`}>
        <div className={styles.icon}>
          {type === "success" ? (
            <span className={styles.check}>✓</span>
          ) : (
            <span className={styles.exclamation}></span>
          )}
        </div>
        <h2 className={styles.title}>
          {type === "success" ? "SUCCESS" : "NOTICE"}
        </h2>

        <p className={styles.message}>{message}</p>

        <button className={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default MessagePopup;
