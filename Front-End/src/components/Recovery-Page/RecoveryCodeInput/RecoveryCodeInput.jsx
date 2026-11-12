import { useRef } from "react";
import styles from "./recoveryCodeInput.module.css";

function RecoveryCodeInput({ value, onChange, onBlur, error }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const code = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(code);
  }

  function handlePaste(e) {
    e.preventDefault();
    const pastedCode = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pastedCode);
  }
  return (
    <div className={styles.container}>
      <label className={styles.label}>VERIFICATION CODE</label>

      <div
        className={styles.codeContainer}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="6-digit verification code"
          aria-invalid={Boolean(error)}
          maxLength={6}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={onBlur}
        />

        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className={`${styles.box} ${
              value[index] ? styles.filled : ""
            } ${error ? styles.invalid : ""}`}
            aria-hidden="true"
          >
            {value[index] || ""}
          </div>
        ))}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default RecoveryCodeInput;
