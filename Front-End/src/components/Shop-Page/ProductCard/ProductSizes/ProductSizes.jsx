import styles from "./productSizes.module.css";
import { ProductSize } from "../../../../Enums/products.js";
function ProductSizes({ selectedSize, compact = false }) {
  // display only the product's size in the card,
  // and all available size options in the popup
  const sizes = compact
    ? [selectedSize]
    : Object.values(ProductSize).filter((size) => size !== ProductSize.NONE);

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ""}`}>
      <span className={styles.label}>SIZE</span>
      <div className={styles.sizes}>
        {sizes.map((size) => (
          <span
            key={size}
            className={`${styles.size} ${size === selectedSize ? styles.selected : ""}`}
          >
            {size}
          </span>
        ))}
      </div>
    </div>
  );
}
export default ProductSizes;
