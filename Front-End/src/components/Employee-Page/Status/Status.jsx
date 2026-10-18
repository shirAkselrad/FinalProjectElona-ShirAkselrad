import { useState } from "react";
import { FiChevronDown } from "react-icons/fi"; //החץ הקטן שפותח את הבחירה
import MessagePopup from "../../General/MessagePopup/MessagePopup";
import styles from "./status.module.css";
/**
 *
 * @param {status} status of the order
 * @returns Status
 */
function Status({ status, order_id, onStatusChange, openStatusOrderId, setOpenStatusOrderId }) {
  //the state variable which tells if the choosing options are open or closed, by default close
  const isOpen=openStatusOrderId===order_id; 

  const [isUpdating, setIsUpdating] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const statusOptions = {
    PROCESSING: [],
    PAID: ["SHIPPED", "CANCELED"],
    SHIPPED: ["COMPLETED"],
    COMPLETED: [],
    CANCELED: [],
  };
  const availableOptions = statusOptions[status] || [];

  async function changeStatus(newStatus) {
   setOpenStatusOrderId(null)
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/employee/orders/${order_id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok)
        throw new Error(`HTTP status error! the error is: ${response.status}`);
      onStatusChange(order_id, newStatus);
    } catch (error) {
      console.error("Couldn't update order status: ", error);
      setPopup({
        show: true,
        message: "Couldn't update order status. Please try again",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className={styles.statusContainer}>
      <button
        className={`${styles.status} ${styles[status.toLowerCase()]}`}
        disabled={isUpdating}
        onClick={() => {
          if (availableOptions.length > 0) setOpenStatusOrderId(isOpen? null: order_id);
        }}
      >
        {status}
        {availableOptions.length > 0 && <FiChevronDown />}
      </button>

      {isOpen && availableOptions.length > 0 && (
        <div className={styles.options}>
          {availableOptions.map((option) => (
            <button
              key={option}
              className={styles[`${option.toLowerCase()}Option`]}
              disabled={isUpdating}
              onClick={() => changeStatus(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() =>
            setPopup({
              show: false,
              message: "",
              type: "",
            })
          }
        />
      )}
    </div>
  );
}

export default Status;
