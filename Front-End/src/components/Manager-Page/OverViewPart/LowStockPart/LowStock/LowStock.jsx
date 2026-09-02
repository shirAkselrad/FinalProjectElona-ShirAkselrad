import styles from "./lowStock.module.css";

import AlertsTitle from "../../AlertsTitle/AlertsTitle.jsx";
import LowStockTable from "../LowStockTable/LowStockTable.jsx";

function LowStock({ products, statuses, stocks }) {
  return (
    <div className={styles.lowStock}>
      <AlertsTitle text="STOCK ALERTS – UPDATE NOW" />

      <div className={styles.tableContainer}>
        <LowStockTable
          products={products}
          statuses={statuses}
          stocks={stocks}
        />
      </div>
    </div>
  );
}

export default LowStock;
