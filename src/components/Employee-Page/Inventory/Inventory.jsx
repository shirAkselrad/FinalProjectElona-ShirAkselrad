import styles from "./inventory.module.css";

import InventoryTable from "../InventoryTable/InventoryTable.jsx";
import SectionTitle from "../SectionTitle/SectionTitle.jsx";

function Inventory({ images, products, categories, prices, stocks }) {
  return (
    <div className={styles.inventory}>
      <div className={styles.top}>
        <SectionTitle title="Inventory" />

        <button className={styles.addProduct}>+ ADD PRODUCT</button>
      </div>

      <InventoryTable
        images={images}
        products={products}
        categories={categories}
        prices={prices}
        stocks={stocks}
      />
    </div>
  );
}

export default Inventory;
