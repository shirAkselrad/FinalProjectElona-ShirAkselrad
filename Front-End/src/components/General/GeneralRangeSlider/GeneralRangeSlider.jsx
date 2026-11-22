import { useState, useEffect } from "react";
import styles from "./generalRangeSlider.module.css";

function GeneralRangeSlider({
  min,
  max,
  minValue,
  maxValue,
  unit = "",
  onChange,
}) {
  const minLimit = Math.floor(Number(min));
  const maxLimit = Math.ceil(Number(max));

  const [range, setRange] = useState({
    min: minValue === "" ? minLimit : Number(minValue),
    max: maxValue === "" ? maxLimit : Number(maxValue),
  });

  useEffect(() => {
    const selectedMin = minValue === "" ? minLimit : Number(minValue);
    const selectedMax = maxValue === "" ? maxLimit : Number(maxValue);

    setRange({
      min: Math.max(minLimit, Math.min(selectedMin, selectedMax)),
      max: Math.min(maxLimit, Math.max(selectedMax, selectedMin)),
    });
  }, [minValue, maxValue, minLimit, maxLimit]);

  const difference = maxLimit - minLimit || 1;
  const minPercent = ((range.min - minLimit) / difference) * 100;
  const maxPercent = ((range.max - minLimit) / difference) * 100;

  const updateRange = (type, value) => {
    const number = Number(value);

    const updatedRange = {
      ...range,
      [type]:
        type === "min"
          ? Math.min(number, range.max)
          : Math.max(number, range.min),
    };

    setRange(updatedRange);

    onChange({
      minValue: updatedRange.min === minLimit ? "" : String(updatedRange.min),
      maxValue: updatedRange.max === maxLimit ? "" : String(updatedRange.max),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.values}>
        <span>
          {range.min} {unit}
        </span>
        <span>
          {range.max} {unit}
        </span>
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
          className={`${styles.rangeInput} ${styles.minRange}`}
          aria-label={`Minimum ${unit}`}
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step="1"
          value={range.max}
          onChange={(e) => updateRange("max", e.target.value)}
          className={`${styles.rangeInput} ${styles.maxRange}`}
          aria-label={`Maximum ${unit}`}
        />
      </div>

      <div className={styles.limits}>
        <span>
          {minLimit} {unit}
        </span>
        <span>
          {maxLimit} {unit}
        </span>
      </div>
    </div>
  );
}

export default GeneralRangeSlider;
