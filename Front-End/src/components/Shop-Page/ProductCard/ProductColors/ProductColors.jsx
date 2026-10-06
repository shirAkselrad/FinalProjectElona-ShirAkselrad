import styles from "./productColors.module.css";

function ProductColors({ colors }) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>COLOR</span>

      <div className={styles.colors}>
        {colors.map((color) => (
          <span
            key={color}
            className={styles.color}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductColors;
