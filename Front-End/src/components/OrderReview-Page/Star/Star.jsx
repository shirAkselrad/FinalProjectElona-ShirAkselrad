import styles from "./star.module.css";
function Star({ value, filled, onClick }) {
  return (
    <button
      type="button"
      className={styles.star}
      onClick={() => onClick(value)}
      aria-label={`Rate ${value} stars`}
      aria-pressed={filled}
    >
      {filled ? "★" : "☆"}
    </button>
  );
}
export default Star;
