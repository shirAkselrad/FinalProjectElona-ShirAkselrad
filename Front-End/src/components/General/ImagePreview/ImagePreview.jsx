import styles from "./imagePreview.module.css";

function ImagePreview({ src, name, onRemove }) {
  return (
    <div className={styles.container} onClick={onRemove}>
      <img className={styles.image} src={src} alt={name} draggable={false} />

      <div className={styles.removeOverlay}>
        <span>×</span>
      </div>
    </div>
  );
}

export default ImagePreview;
