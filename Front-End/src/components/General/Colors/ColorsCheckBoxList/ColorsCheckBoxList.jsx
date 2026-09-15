import ColorCheckBox from "../ColorCheckBox/ColorCheckBox.jsx";
import styles from "./colorsCheckBoxList.module.css";

function ColorsCheckBoxList({ colors, selectedColors, onChange, error }) {
  return (
    <div>
      <div
        className={`${styles.colorsList} ${
          error ? styles.colorsListError : ""
        }`}
      >
        {colors.map((color) => (
          <ColorCheckBox
            key={color.id}
            color={color}
            checked={selectedColors.includes(color.name)}
            onChange={onChange}
          />
        ))}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default ColorsCheckBoxList;
