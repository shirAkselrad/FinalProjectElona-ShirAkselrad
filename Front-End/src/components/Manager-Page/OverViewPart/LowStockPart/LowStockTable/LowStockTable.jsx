import styles from "./lowStockTable.module.css";

import LowStockRow from "../LowStockRow/LowStockRow.jsx";

function LowStockTable({ products, onEdit }) {
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
        {products.map((product) => (
          <LowStockRow
            key={product.product_id}
            product={product}
            onEdit={() => onEdit(product)}
          />
        ))}
      </tbody>
    </table>
  );
}

export default LowStockTable;
