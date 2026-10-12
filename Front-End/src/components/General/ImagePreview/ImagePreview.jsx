import styles from "./imagePreview.module.css";

function ImagePreview({ src, name, onRemove }) {
  return (
    <div
      className={styles.container}
      onClick={onRemove}
      styles={{ cursor: onRemove ? "pointer" : "default" }}
    >
      <img className={styles.image} src={src} alt={name} draggable={false} />

      {onRemove && (
        <div className={styles.removeOverlay}>
          <span>×</span>
        </div>
      )}
    </div>
  );
}

export default ImagePreview;
