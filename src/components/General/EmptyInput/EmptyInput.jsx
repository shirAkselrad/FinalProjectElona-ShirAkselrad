import styles from "./emptyInput.module.css";

function EmptyInput({ value, onChange }) {
  return (
    <input
      className={styles.input}
      type="text"
      value={value}
      onChange={onChange}
    />
  );
}

export default EmptyInput;
