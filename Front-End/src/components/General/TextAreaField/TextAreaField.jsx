import styles from "./textAreaField.module.css";
import InputLabel from "../InputLabel/InputLabel.jsx";

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
}) {
  return (
    <div>
      <InputLabel text={label} />

      <textarea
        className={styles.textarea}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />

      <div className={styles.bottomRow}>
        {error && <span className={styles.error}>{error}</span>}

        {maxLength && (
          <span className={styles.counter}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export default TextAreaField;
