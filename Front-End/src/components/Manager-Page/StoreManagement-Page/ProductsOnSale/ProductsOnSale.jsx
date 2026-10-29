import styles from "./productsOnSale.module.css";
import InventoryTable from "../../../Employee-Page/InventoryPage/InventoryTable/InventoryTable";
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
      <InventoryTable
        inventory={productsOnSale}
        onSave={onSave}
        onRemove={onRemove}
        isManager={true}
        showStockSummary={false}
      />
    </div>
  );
}
export default ProductsOnSale;
