import styles from "./managementFilters.module.css";
import CategoryBtn from "../../Shop-Page/CategoryBtn/CategoryBtn.jsx";

function ManagementFilters({ title, filters }) {
  const rows = [];

  for (let i = 0; i < filters.length; i += 2) {
    rows.push(filters.slice(i, i + 2));
  }

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.filtersInner}>
        <div className={styles.filtersHeader}>{title}</div>

        <div className={styles.filtersRows}>
          {rows.map((row, index) => (
            <div className={styles.filtersRow} key={index}>
              {row.map((filter) => (
                <div className={styles.filterGroup} key={filter.title}>
                  <span className={styles.filterTitle}>{filter.title}</span>

                  {filter.options.map((option) => (
                    <CategoryBtn
                      key={option}
                      text={option.toUpperCase()}
                      variant="light"
                      active={filter.selected === option}
                      onClick={() => filter.setSelected(option)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagementFilters;
