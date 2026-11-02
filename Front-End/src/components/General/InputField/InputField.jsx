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
  min,
  max,
  value,
  disabled = false,
  readOnly = false,
  suffix,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <div className={styles.inputContent}>
          <input
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            inputMode={inputMode}
            disabled={disabled}
            readOnly={readOnly}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            step={step}
            min={min}
            max={max}
          />

          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default InputField;
