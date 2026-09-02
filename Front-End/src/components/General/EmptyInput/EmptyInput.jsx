import styles from "./emptyInput.module.css";

/**
 *
 * @param {value} value which enters by default
 * @param {onChange} onChange the event which accure when the user changes the input value
 * @returns EmptyInput
 */
function EmptyInput({ value, onChange, onBlur, error, maxLength }) {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
      />

      <div className={styles.errorArea}>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
}

export default EmptyInput;
