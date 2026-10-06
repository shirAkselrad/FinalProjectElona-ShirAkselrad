import styles from "./productImg.module.css";

function ProductImg({ image, name, editable = false, onImageClick }) {
  let imageSrc = null;
  if (image)
    if (image.file instanceof File) imageSrc = URL.createObjectURL(image.file);
    else imageSrc = image.path;
  return (
    <div
      className={styles.imageContainer}
      onClick={editable ? onImageClick : undefined}
    >
      {image ? (
        <div className={styles.imageWrapper}>
          <img src={imageSrc} alt={name} className={styles.productImage} />

          <div className={styles.imageOverlay}>
            <span>{editable ? "CHANGE IMAGE" : "VIEW DETAILS"}</span>
          </div>
        </div>
      ) : editable ? (
        <div className={styles.emptyImage}>
          <span>CLICK TO ADD FRONT IMAGE</span>
        </div>
      ) : null}
    </div>
  );
}

export default ProductImg;
