import styles from "./categoryTypesList.module.css";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import InputField from "../../../General/InputField/InputField";
import Remove from "../../../General/Remove/Remove";

function CategoryTypesList({ types, onChange, maxTypes = 15 }) {
  //this function adds an empty input
  function handleAdd() {
    if (types.length >= maxTypes) return;
    onChange([
      ...types,
      {
        name: "",
        min_sales: "",
        sales_check_days: "",
      },
    ]);
  }

  //this function updates a specific category type input
  function handleChange(index, field, value) {
    const updatedTypes = [...types];
    updatedTypes[index] = {
      ...updatedTypes[index],
      [field]: value,
    };
    onChange(updatedTypes);
  }

  //this function removes a category type
  function handleRemove(index) {
    if (types.length === 1) return;
    onChange(types.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Types</label>

        <GeneralBtn
          text="+ Add Type"
          type="button"
          onClick={handleAdd}
          disabled={types.length >= maxTypes}
          className={styles.addBtn}
        />
      </div>

      <div className={styles.types}>
        {types.map((type, index) => (
          <div className={styles.typeItem} key={index}>
            <div className={styles.typeHeader}>
              <span className={styles.typeTitle}>Type {index + 1}</span>

              {types.length > 1 && (
                <Remove onClick={() => handleRemove(index)} />
              )}
            </div>

            <InputField
              label="Type Name"
              placeholder="Enter type name"
              value={type.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />

            <div className={styles.row}>
              <InputField
                label="Minimum Sales"
                placeholder="Enter minimum sales"
                type="number"
                value={type.min_sales}
                onChange={(e) =>
                  handleChange(index, "min_sales", e.target.value)
                }
              />

              <InputField
                label="Check After (Days)"
                placeholder="Enter number of days"
                type="number"
                value={type.sales_check_days}
                onChange={(e) =>
                  handleChange(index, "sales_check_days", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CategoryTypesList; 