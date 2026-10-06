import styles from "./productSizes.module.css";
import { ProductSize } from "../../../../Enums/products.js";
function ProductSizes({ selectedSize }) {
  //all the products sizes from all the sizes
  const sizes = Object.values(ProductSize).filter(
    (size) => size != ProductSize.NONE,
  );

  return (
    <div className={styles.container}>
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
