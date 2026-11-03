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
}) {
  const formatLocalDateTime = (date) => {
    if (!date) return "";

    const pad = (num) => String(num).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const datePickerRef = useRef(null);
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <div className={styles.inputWrapper}>
        <div className={styles.inputContent}>
          <DatePicker
            ref={datePickerRef}
            selected={value ? new Date(value) : null}
            onChange={(date) => onChange(formatLocalDateTime(date))}
            onChangeRaw={() => {}}
            onSelect={(date, event) => {
              if (event?.target?.closest(".react-datepicker__time-list-item")) {
                datePickerRef.current?.setOpen(false);
              }
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            minDate={minDate ? new Date(minDate) : undefined}
            maxDate={maxDate ? new Date(maxDate) : undefined}
            placeholderText={placeholder}
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
