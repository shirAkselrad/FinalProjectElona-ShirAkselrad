import styles from "./inventoryTable.module.css";
import InventoryRow from "../InventoryRow/InventoryRow.jsx";
import { useState } from "react";
import EditInventoryPopup from "../EditInventoryPopup/EditInventoryPopup.jsx";

/**
 *
 * @param {inventory} inventory array
 * @param {onSave} onSave an event which will happen when the user click on the save btn
 * @param {onRemove} onRemove an even which will happen when the user click on the remove btn
 * @returns InventoryTable
 */
function InventoryTable({ inventory, onSave, onRemove }) {
  //state which give info about which inv in the inventory table is getting change
  const [selectedInv, setSelectedInv] = useState(null);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.productIdCol} />
          <col className={styles.nameCol} />
          <col className={styles.categoryCol} />
          <col className={styles.colorCol} />
          <col className={styles.sizeCol} />
          <col className={styles.priceCol} />
          <col className={styles.costPriceCol} />
          <col className={styles.discountCol} />
          <col className={styles.quantityCol} />
          <col className={styles.minStockCol} />
          <col className={styles.statusCol} />
          <col className={styles.restockCol} />
          <col className={styles.actionsCol} />
        </colgroup>

        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Color</th>
            <th>Size</th>
            <th>Price</th>
            <th>Cost Price</th>
            <th>Discount</th>
            <th>Quantity</th>
            <th>Min Stock</th>
            <th>Status</th>
            <th>Restock Required</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/*building the inventory row, sending to each row both remove and edit events */}
        <tbody>
          {inventory.map((inv) => (
            <InventoryRow
              onRemove={() => onRemove(inv)}
              onEdit={() => setSelectedInv(inv)}
              key={inv.product_id}
              inv={inv}
            />
          ))}
        </tbody>
      </table>

      {/*if selectedInv is not null it means the edit btn was clicked, so the editInventoryPopup will be present, gets the selectedInv to edit, the onSave event and the onClose event which will be oprate after and will return the selectedInv to null  */}
      {selectedInv && (
        <EditInventoryPopup
          inv={selectedInv}
          onSave={onSave}
          onClose={() => {
            setSelectedInv(null);
          }}
        />
      )}
    </div>
  );
}

export default InventoryTable;
