import InputField from "../InputField/InputField";
import RemoveInputBtn from "../RemoveInputBtn/RemoveInputBtn";
import styles from "./dynamicInputItem.module.css";

function DynamicInputItem({
  value,
  onChange,
  onRemove,
  placeholder = "",
  disabled = false,
  error = "",
}) {
  return (
    <div className={styles.container}>
      <InputField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
      />
      <RemoveInputBtn onClick={onRemove} disabled={disabled} />
    </div>
  );
}
export default DynamicInputItem;
