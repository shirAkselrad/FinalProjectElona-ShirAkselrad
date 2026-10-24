import styles from "./lowStock.module.css";

import AlertsTitle from "../../AlertsTitle/AlertsTitle.jsx";
import LowStockTable from "../LowStockTable/LowStockTable.jsx";

function LowStock({ products, onEdit }) {
  return (
    <div className={styles.lowStock}>
      <AlertsTitle text="STOCK ALERTS – UPDATE NOW" />

      <div className={styles.tableContainer}>
        <LowStockTable products={products} onEdit={onEdit} />
      </div>
    </div>
  );
}

export default LowStock;
