import styles from "./inventoryRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";

function InventoryRow({ inv, onEdit, onRemove, onImages }) {
  const [displayMesssagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  //The function send the new status to backend
  async function updateProductStatus(invData) {
    try {
      const response = await fetch("/api/employee/changeProductStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invData),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error updating inv's status: ", error);
    }
  }

  async function changeStatus() {
    const newStatus = inv.status === "Active" ? "Not Active" : "Active";
    const invData = {
      product_id: inv.product_id,
      status: newStatus,
    };
    console.log("sending: ", invData);
    const data = await updateProductStatus(invData);
    console.log("response: ", data);
    if (data?.success) {
      onRemove({
        ...inv,
        status: newStatus,
      });
    } else {
      setDisplayMessagePopup({
        show: true,
        message: data?.message,
        type: "error",
      });
    }
  }
  return (
    <tr
      className={`${styles.row} ${
        inv.status === "Not Active" ? styles.removed : ""
      }`}
    >
      <td>{inv.product_id}</td>
      <td>{inv.name}</td>
      <td>{inv.category}</td>
      <td>{inv.colors}</td>
      <td>{inv.size}</td>
      <td>{inv.price}₪</td>
      <td>{inv.cost_price}₪</td>
      <td>{inv.discount}%</td>
      <td>{inv.quantity}</td>
      <td>{inv.min_stock}</td>
      <td>{inv.restock_required ? "Yes" : "No"}</td>
      <td>
        <div className={styles.actions}>
          <EditBtn onClick={onEdit} />

          <BrightGeneralBtn text="IMAGES" onClick={onImages} />

          <BrightGeneralBtn
            text={inv.status === "Active" ? "REMOVE" : "RESTORE"}
            onClick={changeStatus}
          />

          {displayMesssagePopup.show && (
            <MessagePopup
              message={displayMesssagePopup.message}
              type={displayMesssagePopup.type}
              onClose={() =>
                setDisplayMessagePopup({
                  show: false,
                  message: "",
                  type: "",
                })
              }
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default InventoryRow;
