import styles from "./productTitle.module.css";

function ProductTitle({ category, name, description }) {
  return (
    <div className={styles.productTitle}>
      <p className={styles.category}>{category}</p>

      <h1 className={styles.name}>{name}</h1>

      <p className={styles.description}>{description}</p>

      <div className={styles.decoration}>
        <span className={styles.line}></span>
        <span className={styles.diamond}></span>
        <span className={styles.line}></span>
      </div>
    </div>
  );
}

export default ProductTitle;
