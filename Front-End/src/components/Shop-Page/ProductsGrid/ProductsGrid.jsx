import styles from "./productsGrid.module.css";

import ProductCard from "../ProductCard/ProductCard.jsx";

function ProductsGrid({ products, frontImgs }) {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          image={frontImgs.find((img) => img.product_id === product.product_id)}
          category={product.category}
          name={product.name}
          description={product.description}
          price={product.price}
        />
      ))}
    </div>
  );
}

export default ProductsGrid;
