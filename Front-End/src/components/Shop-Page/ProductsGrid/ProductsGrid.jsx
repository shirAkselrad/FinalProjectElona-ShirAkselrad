import styles from "./productsGrid.module.css";

import ProductCard from "../ProductCard/ProductCard.jsx";

function ProductsGrid({ products, frontImgs }) {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          image={frontImgs.find((img) => img.product_id === product.product_id)}
        />
      ))}
    </div>
  );
}

export default ProductsGrid;
