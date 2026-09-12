import styles from "./inventoryRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";

function InventoryRow({ inv, onEdit, onRemove }) {
  return (
    <tr className={`${styles.row} ${inv.removed ? styles.removed : ""}`}>
      <td>{inv.product_id}</td>
      <td>{inv.name}</td>
      <td>{inv.category}</td>
      <td>{inv.color}</td>
      <td>{inv.size}</td>
      <td>${inv.price}</td>
      <td>${inv.cost_price}</td>
      <td>{inv.discount}%</td>
      <td>{inv.quantity}</td>
      <td>{inv.min_stock}</td>
      <td>{inv.status}</td>
      <td>{inv.restock_required ? "Yes" : "No"}</td>
      <td>
        <div className={styles.actions}>
          <EditBtn onClick={onEdit} />

          <BrightGeneralBtn
            text={inv.removed ? "RESTORE" : "REMOVE"}
            onClick={onRemove}
          />
        </div>
      </td>
    </tr>
  );
}

export default InventoryRow;
