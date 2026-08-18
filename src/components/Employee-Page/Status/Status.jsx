import { useState } from "react";
import { FiChevronDown } from "react-icons/fi"; //החץ הקטן שפותח את הבחירה

import styles from "./status.module.css";
/**
 *
 * @param {status} status of the order
 * @returns Status
 */
function Status({ status }) {
  //the current status of the order, the default value is given to the component
  const [currentStatus, setCurrentStatus] = useState(status);

  //the state variable which tells if the choosing options are open or closed, by default close
  const [isOpen, setIsOpen] = useState(false);

  //the function change the status according to the choice, and close it after the click
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
