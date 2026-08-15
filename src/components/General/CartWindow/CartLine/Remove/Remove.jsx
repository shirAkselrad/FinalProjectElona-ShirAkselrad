import styles from "./remove.module.css";

function Remove({ onClick }) {
  return (
    <button
      className={styles.remove}
      onClick={onClick}
      type="button"
      aria-label="Remove product"
    >
      ×
    </button>
  );
}

export default Remove;
