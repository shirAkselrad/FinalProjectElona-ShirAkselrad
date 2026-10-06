import styles from "./productDetails.module.css";
import ProductColors from "../../ProductCard/ProductColors/ProductColors";
import ProductSizes from "../../ProductCard/ProductSizes/ProductSizes";
import ProductPrice from "../../ProductPrice/ProductPrice";

function ProductDetails({ product }) {
  console.log("PRODUCT DETAILS:", product);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.category}>{product.category}</span>
        <h2 className={styles.name}>{product.name}</h2>

        {!product.restock_required && (
          <span className={styles.limitedStock}>LIMITED STOCK</span>
        )}
        <div className={styles.price}>
          <ProductPrice price={product.price} discount={product.discount} />
        </div>
      </div>

      <div className={styles.options}>
        <ProductColors colors={product.colors} />
        <ProductSizes selectedSize={product.size} />
      </div>

      <p className={styles.description}>{product.description}</p>
    </div>
  );
}
export default ProductDetails;
