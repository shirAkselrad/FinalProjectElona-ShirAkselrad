import styles from "./inventoryRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";

function InventoryRow({ inv, onEdit, onRemove, onImages, isManager = false }) {
  const [displayMesssagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  //The function send the new status to backend
  async function updateProductStatus(invData) {
    try {
      const url = isManager
        ? "/api/manager/changeProductStatus"
        : "/api/employee/changeProductStatus";
      const response = await fetch(url, {
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

  const isOutOfStock =
    Number(inv.restock_required) === 1 && Number(inv.quantity) === 0;
  const isLowStock =
    Number(inv.restock_required) === 1 &&
    Number(inv.quantity) > 0 &&
    Number(inv.quantity) <= Number(inv.min_stock);
  return (
    <tr
      className={`${styles.row} ${
        inv.status === "Not Active"
          ? styles.removed
          : isOutOfStock
            ? styles.outOfStock
            : isLowStock
              ? styles.lowStock
              : ""
      }`}
    >
      <td>{inv.product_id}</td>
      <td>{inv.name}</td>
      <td>{inv.category}</td>
      <td>{inv.type}</td>
      <td>{inv.colors}</td>
      <td>{inv.size}</td>
      <td>{inv.price}₪</td>
      <td>{inv.cost_price}₪</td>
      <td>{inv.discount}%</td>
      <td>
        <div className={styles.quantityCell}>
          {inv.status === "Active" && isOutOfStock ? (
            <span className={styles.outOfStockLable}>Out Of Stock</span>
          ) : (
            <div>
              <span>{inv.quantity}</span>
              {inv.status === "Active" && isLowStock && (
                <span className={styles.lowStockLabel}>Low Stock</span>
              )}
            </div>
          )}
        </div>
      </td>
      <td>{inv.min_stock ?? "-"}</td>
      <td>{inv.restock_required ? "Yes" : "No"}</td>
      <td>
        <div className={styles.actions}>
          <EditBtn onClick={onEdit} />

          <BrightGeneralBtn text="PRODUCT PREVIEW" onClick={onImages} />

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
