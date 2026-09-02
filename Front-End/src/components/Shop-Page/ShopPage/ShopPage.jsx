import styles from "./shopPage.module.css";

import SearchBar from "../../General/SearchBar/SearchBar.jsx";
import CategoryBtn from "../CategoryBtn/CategoryBtn.jsx";
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";

import products from "../proudcts.js";

function ShopPage() {
  return (
    <main className={styles.shopPage}>
      <div className={styles.controls}>
        <SearchBar />

        <div className={styles.categories}>
          <CategoryBtn text="ALL" />
          <CategoryBtn text="BROOCHES" />
          <CategoryBtn text="PENDANTS" />
          <CategoryBtn text="HANDBAGS" />
          <CategoryBtn text="WATCHES" />
          <CategoryBtn text="ACCESSORIES" />
        </div>
      </div>

      <ProductsGrid products={products} />
    </main>
  );
}

export default ShopPage;
