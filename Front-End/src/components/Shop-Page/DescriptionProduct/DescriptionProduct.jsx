import styles from "./descriptionProduct.module.css";

function DescriptionProduct({ category, name, description }) {
  return (
    <div className={styles.descriptionProduct}>
      <p className={styles.category}>{category}</p>

      <h2 className={styles.name}>{name}</h2>

      <p className={styles.description}>{description}</p>

      <div className={styles.line}></div>
    </div>
  );
}

export default DescriptionProduct;
