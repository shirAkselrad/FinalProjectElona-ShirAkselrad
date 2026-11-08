import styles from "./generalRadioBtn.module.css";

function GeneralRadioBtn({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <label className={styles.container}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}

export default GeneralRadioBtn;
