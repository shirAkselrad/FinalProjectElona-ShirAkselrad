import styles from "./inventoryRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";

/**
 *
 * @param {inv} inv the current inv
 * @param {onEdit} onEdit an event which will happen only when the edit btn will be clicked
 * @param {onRemove} onRemove an event which will happen only whhen the remove btn will be clicked
 * @returns
 */
function InventoryRow({ inv, onEdit, onRemove }) {
  return (
    <tr className={`${styles.row} ${inv.removed ? styles.removed : ""}`}>
      <td>
        <div className={styles.product}>
          <img src={inv.image} alt={inv.name} />
          <span>{inv.name}</span>
        </div>
      </td>

      <td>{inv.category}</td>

      <td className={styles.price}>${inv.price}</td>

      <td className={inv.stock === 0 ? styles.outOfStock : ""}>{inv.stock}</td>

      <td>
        <div className={styles.actions}>
          {/*when the edit btn click it gets the onEdit function to operate */}
          <EditBtn onClick={onEdit} className={styles.editBtn} />

          {/*When the use click it make the onRemove function to operate */}
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
