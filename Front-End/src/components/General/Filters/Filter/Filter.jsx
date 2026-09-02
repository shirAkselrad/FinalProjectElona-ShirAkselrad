import styles from "./filter.module.css";

function Filter({ title, options, selected, setSelected }) {
  return (
    <div className={styles.filter}>
      <label>{title}</label>

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
