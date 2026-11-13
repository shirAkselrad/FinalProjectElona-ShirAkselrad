import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./dateTimePicker.module.css";
import { useRef } from "react";

function DateTimePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  placeholder = "Select date and time",
  dateOnly = false,
}) {
  const datePickerRef = useRef(null);

  const formatLocalDateTime = (date) => {
    if (!date) return "";

    const pad = (num) => String(num).padStart(2, "0");

    const datePart = `${date.getFullYear()}-${pad(
      date.getMonth() + 1,
    )}-${pad(date.getDate())}`;

    if (dateOnly) return datePart;

    return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const parseDate = (dateValue) => {
    if (!dateValue) return null;

    if (dateValue instanceof Date) {
      return dateValue;
    }

    if (dateOnly) {
      const [year, month, day] = dateValue.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    return new Date(dateValue);
  };

  const min = parseDate(minDate);
  const max = parseDate(maxDate);

  const handleChange = (date) => {
    if (date) {
      if (min && date < min) return;
      if (max && date > max) return;
    }

    onChange(formatLocalDateTime(date));
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <div className={styles.inputWrapper}>
        <div className={styles.inputContent}>
          <DatePicker
            ref={datePickerRef}
            selected={parseDate(value)}
            onChange={handleChange}
            onChangeRaw={() => {}}
            onSelect={(date, event) => {
              if (
                !dateOnly &&
                event?.target?.closest(".react-datepicker__time-list-item")
              ) {
                datePickerRef.current?.setOpen(false);
              }
            }}
            showTimeSelect={!dateOnly}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat={dateOnly ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
            minDate={min}
            maxDate={max}
            placeholderText={dateOnly ? "Select date" : placeholder}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            calendarClassName={styles.calendar}
          />
        </div>
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default DateTimePicker;
