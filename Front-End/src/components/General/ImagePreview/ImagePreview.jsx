import styles from "./imagePreview.module.css";

function ImagePreview({ src, name, onRemove }) {
  return (
    <div className={styles.container}>
      <div className={styles.imageBox}>
        <button type="button" className={styles.removeBtn} onClick={onRemove}>
          ×
        </button>

        <img className={styles.image} src={src} alt={name} />
      </div>

      <span className={styles.name}>{name}</span>
    </div>
  );
}

export default ImagePreview;
