import styles from "./inventoryLegend.module.css";

function InventoryLegend({ lowStockCount, outOfStockCount, normalStockCount }) {
  return (
    <div className={styles.legend}>
      <div className={`${styles.item} ${styles.outOfStock}`}>
        <span className={styles.dot} />
        <span>Out of Stock</span>
        <strong>{outOfStockCount}</strong>
      </div>

      <div className={`${styles.item} ${styles.lowStock}`}>
        <span className={styles.dot} />
        <span>Low Stock</span>
        <strong>{lowStockCount}</strong>
      </div>

      <div className={`${styles.item} ${styles.normalStock}`}>
        <span className={styles.dot} />
        <span>Normal Stock</span>
        <strong>{normalStockCount}</strong>
      </div>
    </div>
  );
}

export default InventoryLegend;
