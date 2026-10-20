import DynamicInputItem from "../DynamicInputItem/DynamicInputItem";
import GeneralBtn from "../GeneralBtn/GeneralBtn";
import styles from "./dynamicInputsList.module.css";

function DynamicInputsList({
  values,
  onChange,
  label = "",
  placeholder = "",
  addBtnText = "+ADD",
  maxInputs = Infinity,
}) {
  //this function adds a new empty input to the list
  function handleAdd() {
    if (values.length >= maxInputs) return;
    onChange([...values, ""]);
  }

  //this function updates a specific input value
  function handleChange(index, newValue) {
    const updateValues = [...values];
    updateValues[index] = newValue;
    onChange(updateValues);
  }

  //this function removes an wanted input from the inputs list
  function handleRemove(index) {
    const updateValues = values.filter((_, i) => i !== index);
    onChange(updateValues);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {label && <label className={styles.label}>{label}</label>}

        <GeneralBtn
          text={addBtnText}
          onClick={handleAdd}
          type="button"
          className={styles.addBtn}
          disabled={values.length >= maxInputs}
        />
      </div>

      <div className={styles.inputs}>
        {values.map((value, index) => (
          <DynamicInputItem
            key={index}
            value={value}
            onChange={(newValue) => handleChange(index, newValue)}
            onRemove={() => handleRemove(index)}
            placeholder={placeholder}
          />
        ))}
      </div>
    </div>
  );
}

export default DynamicInputsList;
