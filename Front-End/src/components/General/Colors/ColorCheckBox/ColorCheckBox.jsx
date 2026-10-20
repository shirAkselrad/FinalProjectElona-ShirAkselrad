import styles from "./colorCheckBox.module.css";

function ColorCheckBox({ color, checked, onChange }) {
  return (
    <label
      className={`${styles.colorCheckBox} ${checked ? styles.selected : ""}`}
      title={color.name}
      style={{ backgroundColor: color.hex }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(color.name)}
        aria-label={color.name}
      />

      {checked && <span className={styles.checkMark}>✓</span>}
    </label>
  );
}

export default ColorCheckBox;
