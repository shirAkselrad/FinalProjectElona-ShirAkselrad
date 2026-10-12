import styles from "./plus.module.css";

function Plus({ type = "plus", onClick, disabled = false }) {
  return (
    <button
      type="button"
      className={styles.plusBtn}
      onClick={onClick}
      disabled={disabled}
    >
      {type === "plus" ? "+" : "-"}
    </button>
  );
}

export default Plus;
