import styles from "./star.module.css";
function Star({ value, filled, onClick, readOnly = false }) {
  return (
    <button
      type="button"
      className={styles.star}
      onClick={() => {
        if (!readOnly) onClick(value);
      }}
      disabled={readOnly}
      aria-label={`Rate ${value} stars`}
      aria-pressed={filled}
    >
      {filled ? "★" : "☆"}
    </button>
  );
}
export default Star;
