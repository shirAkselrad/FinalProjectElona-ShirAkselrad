import styles from "./remove.module.css";

function Remove({ onClick, className = "" }) {
  return (
    <button
      className={`${styles.remove} ${className}`}
      onClick={onClick}
      type="button"
      aria-label="Remove product"
    >
      ×
    </button>
  );
}

export default Remove;
