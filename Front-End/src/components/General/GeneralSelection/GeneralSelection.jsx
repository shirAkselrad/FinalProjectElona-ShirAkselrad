import styles from "./generalSelection.module.css";

function GeneralSelection({ value, options, onChange, onBlur, error }) {
  return (
    <div>
      <select
        className={styles.selection}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default GeneralSelection;
