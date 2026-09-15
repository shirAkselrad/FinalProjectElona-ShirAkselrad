import styles from "./colorCheckBox.module.css";

function ColorCheckBox({ color, checked, onChange }) {
  return (
    <label className={styles.colorCheckBox}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(color.name)}
      />

      <span
        className={styles.colorSquare}
        style={{ backgroundColor: color.hex }}
      ></span>

      <span>{color.name}</span>
    </label>
  );
}

export default ColorCheckBox;
