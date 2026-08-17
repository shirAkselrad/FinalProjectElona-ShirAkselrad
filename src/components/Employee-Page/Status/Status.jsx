import { useState } from "react";
import { FiChevronDown } from "react-icons/fi"; //החץ הקטן שפותח את הבחירה

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
        onClick={() => setIsOpen(!isOpen)}>
        {currentStatus}
        <FiChevronDown />
      </button>

      {isOpen && (
        <div className={styles.options}>
          <button
            className={styles.completeOption}
            onClick={() => changeStatus("Completed")}
          >
            Completed
          </button>

          <button
            className={styles.processingOption}
            onClick={() => changeStatus("Processing")}
          >
            Processing
          </button>

          <button
            className={styles.canceledOption}
            onClick={() => changeStatus("Canceled")}
          >
            Canceled
          </button>
        </div>
      )}
    </div>
  );
}

export default Status;
