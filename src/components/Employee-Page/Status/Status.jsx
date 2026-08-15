import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import styles from "./status.module.css";

function Status({ status }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isOpen, setIsOpen] = useState(false);

  function changeStatus(newStatus) {
    setCurrentStatus(newStatus);
    setIsOpen(false);
  }

  return (
    <div className={styles.statusContainer}>
      <button
        className={`${styles.status} ${styles[currentStatus]}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentStatus === "complete" && "Complete"}
        {currentStatus === "processing" && "Processing"}
        {currentStatus === "canceled" && "Canceled"}

        <FiChevronDown />
      </button>

      {isOpen && (
        <div className={styles.options}>
          <button
            className={styles.completeOption}
            onClick={() => changeStatus("complete")}
          >
            Complete
          </button>

          <button
            className={styles.processingOption}
            onClick={() => changeStatus("processing")}
          >
            Processing
          </button>

          <button
            className={styles.canceledOption}
            onClick={() => changeStatus("canceled")}
          >
            Canceled
          </button>
        </div>
      )}
    </div>
  );
}

export default Status;
