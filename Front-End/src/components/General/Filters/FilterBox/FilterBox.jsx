import styles from "./filterBox.module.css";
import Filter from "../Filter/Filter.jsx";
import BrightGeneralBtn from "../../BrightGeneralBtn/BrightGeneralBtn.jsx";

function FilterBox({ filters, reset }) {
  return (
    <div className={styles.filterBox}>
      {filters.map((filter) => (
        <Filter
          key={filter.title}
          title={filter.title}
          options={filter.options}
          selected={filter.selected}
          setSelected={filter.setSelected}
        />
      ))}

      <BrightGeneralBtn onClick={reset} text="RESET FILTERS" />
    </div>
  );
}

export default FilterBox;
