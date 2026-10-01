import styles from "./productImg.module.css";

function ProductImg({ image, name }) {
  return (
    <div className={styles.imageContainer}>
      <img
        src={`http://localhost:3001/src/assets/productsFiles/${image.auto_file_name}`}
        alt={name}
        className={styles.productImage}
      />

      <div className={styles.imageOverlay}>
        <span>VIEW DETAILS</span>
      </div>
    </div>
  );
}

export default ProductImg;
