import styles from "./productDetails.module.css";
import ProductColors from "../../ProductCard/ProductColors/ProductColors";
import ProductSizes from "../../ProductCard/ProductSizes/ProductSizes";
import ProductPrice from "../../ProductPrice/ProductPrice";

function ProductDetails({ product }) {
  const isOutOfStock = Number(product.quantity) <= 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.category}>
          {product.category}/{product.type}
        </span>
        <h2 className={styles.name}>{product.name}</h2>

        {!product.restock_required && !isOutOfStock && (
          <span className={styles.limitedStock}>LIMITED STOCK</span>
        )}
        <div className={styles.price}>
          <ProductPrice price={product.price} discount={product.discount} />
        </div>

        <span
          className={`${styles.availableStock} ${
            isOutOfStock ? styles.outOfStock : ""
          }`}
        >
          {isOutOfStock
            ? "OUT OF STOCK"
            : `${product.quantity} units available`}
        </span>
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
