import styles from "./inventoryTable.module.css";
import InventoryRow from "../InventoryRow/InventoryRow.jsx";

function InventoryTable({ inventory }) {
  return (
    <table className={styles.table}>
      <colgroup>
        <col className={styles.productCol} />
        <col className={styles.categoryCol} />
        <col className={styles.priceCol} />
        <col className={styles.stockCol} />
        <col className={styles.editCol} />
      </colgroup>

      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Edit</th>
        </tr>
      </thead>

      <tbody>
        {inventory.map((inv) => (
          <InventoryRow key={inv.id} inventory={inv} />
        ))}
      </tbody>
    </table>
  );
}

export default InventoryTable;
