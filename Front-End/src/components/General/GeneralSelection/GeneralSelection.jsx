import styles from "./generalSelection.module.css";

function GeneralSelection({ value, options, onChange }) {
  return (
    <select className={styles.selection} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default GeneralSelection;
