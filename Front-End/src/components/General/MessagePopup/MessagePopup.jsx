import styles from "./messagePopup.module.css";
import { useEffect } from "react";
function MessagePopup({
  message,
  type = "success",
  onClose,
  autoClose = false,
  buttonText = "OK",
}) {
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, 800);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);
  return (
    <div className={autoClose ? styles.toastOverlay : styles.overlay}>
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

        {!autoClose && (
          <button className={styles.button} onClick={onClose}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default MessagePopup;
