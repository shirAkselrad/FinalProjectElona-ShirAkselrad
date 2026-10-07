import styles from "./productsGrid.module.css";

import ProductCard from "../ProductCard/ProductCard.jsx";

function ProductsGrid({ products, frontImgs, onViewDetails}) {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          image={frontImgs.find((img) => img.product_id === product.product_id)}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default ProductsGrid;
