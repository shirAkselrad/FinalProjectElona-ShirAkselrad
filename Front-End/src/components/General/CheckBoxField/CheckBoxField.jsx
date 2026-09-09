import styles from "./checkBoxField.module.css";

function CheckBoxField({ text, checked, onChange }) {
  return (
    <label className={styles.checkboxField}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{text}</span>
    </label>
  );
}

export default CheckBoxField;
