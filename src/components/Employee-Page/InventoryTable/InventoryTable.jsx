import styles from "./inventoryTable.module.css";
import InventoryRow from "../InventoryRow/InventoryRow.jsx";

function InventoryTable({ images, products, categories, prices, stocks }) {
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
        {products.map((product, i) => (
          <InventoryRow
            key={i}
            image={images[i]}
            product={product}
            category={categories[i]}
            price={prices[i]}
            stock={stocks[i]}
          />
        ))}
      </tbody>
    </table>
  );
}

export default InventoryTable;
