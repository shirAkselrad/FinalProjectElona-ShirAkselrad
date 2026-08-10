import styles from "./productCard.module.css";

function ProductCard({ image, category, title, description, price }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />

      <div className={styles.content}>
        <p className={styles.category}>{category}</p>

        <h3 className={styles.title}>{title}</h3>

        <p className={styles.description}>{description}</p>

        <div className={styles.divider}></div>

        <div className={styles.bottom}>
          <span className={styles.price}>${price}</span>

          <button className={styles.addButton}>+</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
