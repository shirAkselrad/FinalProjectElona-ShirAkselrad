import styles from "./productImg.module.css";

function ProductImg({ image, name }) {
  return (
    <div className={styles.imageContainer}>
      <img src={image} alt={name} className={styles.productImage} />

      <div className={styles.imageOverlay}>
        <span>VIEW DETAILS</span>
      </div>
    </div>
  );
}

export default ProductImg;
