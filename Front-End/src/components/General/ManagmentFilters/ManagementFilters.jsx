import styles from "./managementFilters.module.css";
import GeneralSelection from "../GeneralSelection/GeneralSelection.jsx";
import BrightGeneralBtn from "../BrightGeneralBtn/BrightGeneralBtn.jsx";
function ManagementFilters({ title, filters }) {
  function handleReset() {
    filters.forEach((filter) => {
      filter.setSelected(filter.defaultValue);
    });
  }
  return (
    <div className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <span>{title}</span>
        <BrightGeneralBtn text="Reset All" onClick={handleReset} />
      </div>

      <div className={styles.filtersContent}>
        {filters.map((filter) => (
          <div
            key={filter.title}
            className={`${styles.filterGroup} ${filter.nested ? styles.nestedFilter : ""}`}
          >
            <label className={styles.filterTitle}>{filter.title}</label>
            <GeneralSelection
              value={filter.selected}
              options={filter.options}
              onChange={(e) => filter.setSelected(e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagementFilters;
