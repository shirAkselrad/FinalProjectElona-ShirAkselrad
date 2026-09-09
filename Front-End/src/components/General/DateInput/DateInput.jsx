import styles from "./dateInput.module.css";
import InputLabel from "../InputLabel/InputLabel.jsx";

function DateInput({ label, value, onChange, min, error }) {
  return (
    <div>
      <InputLabel text={label} />

      <input
        className={styles.dateInput}
        type="date"
        value={value}
        onChange={onChange}
        min={min}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default DateInput;
