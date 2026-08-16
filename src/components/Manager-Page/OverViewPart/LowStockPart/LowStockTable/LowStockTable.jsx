import styles from "./lowStockTable.module.css";

import LowStockRow from "../LowStockRow/LowStockRow.jsx";

function LowStockTable({ products, statuses, stocks }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>PRODUCT</th>
          <th>STATUS</th>
          <th>CURRENT STOCK</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {products.map((product, i) => (
          <LowStockRow
            key={i}
            product={product}
            status={statuses[i]}
            stock={stocks[i]}
          />
        ))}
      </tbody>
    </table>
  );
}

export default LowStockTable;
