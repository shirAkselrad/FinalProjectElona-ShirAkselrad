import styles from "./productsOnSale.module.css";
import InventoryTable from "../../../Employee-Page/InventoryPage/InventoryTable/InventoryTable";
import { FiTag } from "react-icons/fi";
function ProductsOnSale({ inventory, onSave, onRemove }) {
  const productsOnSale = inventory.filter(
    (product) => Number(product.discount) > 0,
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Products On Sale</h2>
        <p>View and manage products with individual discounts.</p>
      </div>
      {productsOnSale.length == 0 ? (
        <div className={styles.emptySales}>
          <div className={styles.emptySales}>
            <FiTag className={styles.emptyIcon} />
            <h3>No Products Currently On Sale</h3>
            <p>Products with discounts will appear here.</p>
          </div>
        </div>
      ) : (
        <InventoryTable
          inventory={productsOnSale}
          onSave={onSave}
          onRemove={onRemove}
          isManager={true}
          showStockSummary={false}
        />
      )}
    </div>
  );
}
export default ProductsOnSale;
