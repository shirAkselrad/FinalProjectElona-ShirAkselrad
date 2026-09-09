import styles from "./colorSelect.module.css";
import { colors } from "../../../data/colors";
import { useState } from "react";
function ColorSelect({ onChange, value }) {
  const [display, setDisplay] = useState(false);
  const selectedColor = colors.find((color) => color.name === value);
  return (
    <div className={styles.colorSelect}>
      <label className={styles.label}>Color</label>

      <div
        className={styles.selected}
        onClick={() => setDisplay((prev) => !prev)}
      >
        <span className={styles.placeholder}>
          {value === "" ? (
            <span className={styles.placeholder}>Select Color</span>
          ) : (
            <div className={styles.selectedColor}>
              <span
                className={styles.colorSquare}
                style={{ backgroundColor: selectedColor?.hex }}
              />
              <span>{value}</span>
            </div>
          )}
        </span>
        <span className={styles.arrow}>⌄</span>
      </div>

      {display && (
        <div className={styles.dropdown}>
          {colors.map((color) => (
            <div
              key={color.name}
              className={styles.colorOption}
              onClick={() => {
                onChange(color.name);
                setDisplay(false);
              }}
            >
              <span
                className={styles.colorSquare}
                style={{ backgroundColor: color.hex }}
              />

              <span>{color.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ColorSelect;
