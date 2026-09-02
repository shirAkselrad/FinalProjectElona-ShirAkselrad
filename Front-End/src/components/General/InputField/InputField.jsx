import styles from "./inputField.module.css";

function InputField({
  label,
  placeholder,
  type = "text",
  onChange,
  onBlur,
  error,
  maxLength,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <input
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
      />

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default InputField;
