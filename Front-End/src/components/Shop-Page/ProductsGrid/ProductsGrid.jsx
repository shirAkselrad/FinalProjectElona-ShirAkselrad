import styles from "./productsGrid.module.css";

import ProductCard from "../ProductCard/ProductCard.jsx";

function ProductsGrid({ products }) {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
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
