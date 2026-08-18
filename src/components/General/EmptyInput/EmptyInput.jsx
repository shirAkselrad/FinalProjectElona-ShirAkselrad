import styles from "./emptyInput.module.css";

/**
 *
 * @param {value} value which enters by default
 * @param {onChange} onChange the event which accure when the user changes the input value
 * @returns EmptyInput
 */
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
