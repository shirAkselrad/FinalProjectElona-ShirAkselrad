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
        {options.length === 0 ? (
          <option value="">None</option>
        ) : (
          options.map((option) => (
            <option
              key={typeof option === "string" ? option : option.value}
              value={typeof option === "string" ? option : option.value}
            >
              {typeof option === "string" ? option : option.label}
            </option>
          ))
        )}
      </select>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default GeneralSelection;
