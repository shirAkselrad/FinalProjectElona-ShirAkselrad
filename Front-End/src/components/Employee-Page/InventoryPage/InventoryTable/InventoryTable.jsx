import styles from "./inventoryTable.module.css";
import InventoryRow from "../InventoryRow/InventoryRow.jsx";
import { useState } from "react";
import EditInventoryPopup from "../EditInventoryPopup/EditInventoryPopup.jsx";
import ProductPreviewPopup from "../ProductPreviewPopup/ProductPreviewPopup.jsx";

function InventoryTable({ inventory, onRemove, onSave, isManager = false }) {
  const [selectedInv, setSelectedInv] = useState(null);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.productIdCol} />
          <col className={styles.nameCol} />
          <col className={styles.categoryCol} />
          <col className={styles.categoryTypeCol} />
          <col className={styles.priceCol} />
          <col className={styles.costPriceCol} />
          <col className={styles.discountCol} />
          <col className={styles.quantityCol} />
          <col className={styles.minStockCol} />
          <col className={styles.restockCol} />
          <col className={styles.actionsCol} />
        </colgroup>

        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Category Type</th>
            <th>Price</th>
            <th>Cost Price</th>
            <th>Discount</th>
            <th>Quantity</th>
            <th>Min Stock</th>
            <th>Restock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((inv) => (
            <InventoryRow
              key={inv.product_id}
              inv={inv}
              isManager={isManager}
              onRemove={onRemove}
              onEdit={() => {
                setSelectedInv(inv);
                setShowPopupEdit(true);
              }}
              onImages={() => {
                setSelectedInv(inv);
                setShowProductPreview(true);
              }}
            />
          ))}
        </tbody>
      </table>

      {showPopupEdit && (
        <EditInventoryPopup
          product={selectedInv}
          onSave={onSave}
          isManager={isManager}
          onClose={() => {
            setSelectedInv(null);
            setShowPopupEdit(false);
          }}
        />
      )}

      {showProductPreview && (
        <ProductPreviewPopup
          product={selectedInv}
          isManager={isManager}
          onClose={() => {
            setSelectedInv(null);
            setShowProductPreview(false);
          }}
        />
      )}
    </div>
  );
}

export default InventoryTable;
