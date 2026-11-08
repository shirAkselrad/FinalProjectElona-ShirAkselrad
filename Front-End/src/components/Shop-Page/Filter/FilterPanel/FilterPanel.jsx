import styles from "./filterPanel.module.css";
import ColorsCheckBoxList from "../../../General/Colors/ColorsCheckBoxList/ColorsCheckBoxList";
import Remove from "../../../General/Remove/Remove";
import GeneralRadioBtn from "../../../General/GeneralRadioBtn/GeneralRadioBtn";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider.jsx";
import { colors } from "../../../../data/colors";

function FilterPanel({ filters, setFilters, filterOptions, onClose }) {
  const availableColors = colors.filter((color) =>
    filterOptions.colors.includes(color.name),
  );
  const handleColorChange = (color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((item) => item !== color)
        : [...prev.colors, color],
    }));
  };

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      sort: "",
      minPrice: "",
      maxPrice: "",
      colors: [],
    }));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>FILTERS</h3>
        <Remove onClick={onClose} />
      </div>
      <div className={styles.section}>
        <h4>SORT BY PRICE</h4>
        <GeneralRadioBtn
          name="priceSort"
          value="price_asc"
          label="Low to High"
          checked={filters.sort === "price_asc"}
          onChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
        />
        <GeneralRadioBtn
          name="priceSort"
          value="price_desc"
          label="High to Low"
          checked={filters.sort === "price_desc"}
          onChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
        />
      </div>
      <div className={styles.section}>
        <h4>PRICE RANGE(₪)</h4>
        <PriceRangeSlider
          min={filterOptions.minPrice}
          max={filterOptions.maxPrice}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={({ minPrice, maxPrice }) =>
            setFilters((prev) => ({
              ...prev,
              minPrice,
              maxPrice,
            }))
          }
        />
      </div>
      <div className={styles.section}>
        <h4>COLORS</h4>
        <ColorsCheckBoxList
          colors={availableColors}
          selectedColors={filters.colors}
          onChange={handleColorChange}
        />
      </div>
      <div className={styles.actions}>
        <GeneralBtn
          text="CLEAR ALL"
          type="button"
          onClick={clearFilters}
          className={styles.clearBtn}
        />
      </div>
    </div>
  );
}
export default FilterPanel;
