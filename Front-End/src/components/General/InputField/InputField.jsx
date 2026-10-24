import styles from "./inputField.module.css";

function InputField({
  label,
  placeholder,
  type = "text",
  onChange,
  onBlur,
  onFocus,
  inputMode,
  error,
  maxLength,
  step,
  value,
  disabled = false,
  readOnly = false,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        inputMode={inputMode}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        step={step}
      />

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default InputField;
