import { useEffect, useState } from "react";
import styles from "./recoveryTimer.module.css";

function RecoveryTimer({ expiresAt, onExpire }) {
  const [remainingSeconds, setRemainingSeconds] = useState(0); //time left
  useEffect(() => {
    if (!expiresAt) return;
    let notified = false; //protecting for starting the time over again

    function updateTimer() {
      //calculting the remaining time
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      //if the time is over and a message haven't sent yet, then sending it
      if (remaining === 0 && !notified) {
        notified = true;
        onExpire();
      }
    }
    updateTimer(); //calculating the time left
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval); //clear the timer every time the useEffect starts new
  }, [expiresAt, onExpire]);

  //for displaying the timer
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
