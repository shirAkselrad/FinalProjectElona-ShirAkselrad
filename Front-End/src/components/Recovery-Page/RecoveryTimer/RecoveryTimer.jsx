import { useEffect, useState } from "react";
import styles from "./recoveryTimer.module.css";

function RecoveryTimer({ expiresAt, onExpire }) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  useEffect(() => {
    if (!expiresAt) return;
    let notified = false;
    function updateTimer() {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining === 0 && !notified) {
        notified = true;
        onExpire();
      }
    }
    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeText =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  return (
    <div className={styles.timer}>
      {remainingSeconds > 0 ? (
        <p>
          Code expires in <span>{timeText}</span>
        </p>
      ) : (
        <p className={styles.expired}>Your verification code has expired.</p>
      )}
    </div>
  );
}
export default RecoveryTimer;
