import { useState, useEffect } from "react";
import styles from "./priceRangeSlider.module.css";

function PriceRangeSlider({ min, max, minPrice, maxPrice, onChange }) {
  const minLimit = Math.floor(Number(min));
  const maxLimit = Math.ceil(Number(max));
  const [range, setRange] = useState({
    min: minPrice === "" ? minLimit : Number(minPrice),
    max: maxPrice === "" ? maxLimit : Number(maxPrice),
  });

  useEffect(() => {
    const selectedMin = minPrice === "" ? minLimit : Number(minPrice);
    const selectedMax = maxPrice === "" ? maxLimit : Number(maxPrice);

    setRange({
      min: Math.min(selectedMin, selectedMax - 1),
      max: selectedMax,
    });
  }, [minPrice, maxPrice, minLimit, maxLimit]);

  const difference = maxLimit - minLimit || 1;
  const minPercent = ((range.min - minLimit) / difference) * 100;
  const maxPercent = ((range.max - minLimit) / difference) * 100;

  const updateRange = (type, value) => {
    const number = Number(value);
    setRange((prev) => ({
      ...prev,
      [type]:
        type === "min"
          ? Math.min(number, prev.max - 1)
          : Math.max(number, prev.min + 1),
    }));
  };

  const saveRange = () => {
    onChange({
      minPrice: range.min === minLimit ? "" : String(range.min),
      maxPrice: range.max === maxLimit ? "" : String(range.max),
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.prices}>
        <span>₪{range.min}</span>
        <span>₪{range.max}</span>
      </div>

      <div className={styles.slider}>
        <div className={styles.track} />

        <div
          className={styles.selectedTrack}
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step="1"
          value={range.min}
          onChange={(e) => updateRange("min", e.target.value)}
          onPointerUp={saveRange}
          onKeyUp={saveRange}
          className={`${styles.rangeInput} ${styles.minRange}`}
          aria-label="Minimum price"
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step="1"
          value={range.max}
          onChange={(e) => updateRange("max", e.target.value)}
          onPointerUp={saveRange}
          onKeyUp={saveRange}
          className={`${styles.rangeInput} ${styles.maxRange}`}
          aria-label="Maximum price"
        />
      </div>

      <div className={styles.limits}>
        <span>₪{minLimit}</span>
        <span>₪{maxLimit}</span>
      </div>
    </div>
  );
}

export default PriceRangeSlider;
