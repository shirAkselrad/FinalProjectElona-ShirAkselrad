import { useState } from "react";
import styles from "./reportsDateFilter.module.css";
import CategoryBtn from "../../../Shop-Page/CategoryBtn/CategoryBtn";
import DateTimePicker from "../../../General/DateTimePicker/DateTimePicker";

function ReportsDateFilter({ dateRange, setDateRange }) {
  const [period, setPeriod] = useState("Last Month");
  const periodOptions = [
    "Last Week",
    "Last Month",
    "Last 3 Months",
    "Last 6 Months",
    "Last Year",
    "All Time",
    "Custom Range",
  ];

  //formatting date according to local time
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  //changing the selected display period
  function handlePeriodChange(value) {
    setPeriod(value);
    if (value === "Custom Range") return;
    if (value === "All Time") {
      setDateRange({ from: "", to: "" });
      return;
    }
    const to = new Date();
    const from = new Date(to);
    switch (value) {
      case "Last Week":
        from.setDate(from.getDate() - 7);
        break;
      case "Last Month":
        from.setDate(from.getDate() - 30);
        break;
      case "Last 3 Months":
        from.setDate(from.getDate() - 90);
        break;
      case "Last 6 Months":
        from.setDate(from.getDate() - 180);
        break;
      case "Last Year":
        from.setDate(from.getFullYear() - 1);
        break;
    }
    setDateRange({
      from: formatDate(from),
      to: formatDate(to),
    });
  }
  return (
    <div className={styles.dateFilter}>
      <div className={styles.periodSelection}>
        <label className={styles.label}>Display Period</label>
        <div className={styles.periodButtons}>
          {periodOptions.map((option) => {
            return (
              <CategoryBtn
                key={option}
                text={option}
                active={period === option}
                onClick={() => handlePeriodChange(option)}
                variant="light"
              />
            );
          })}
        </div>
      </div>
      {period === "Custom Range" && (
        <div className={styles.customRange}>
          <DateTimePicker
            label="From"
            value={dateRange.from}
            maxDate={dateRange.to || formatDate(new Date())}
            dateOnly={true}
            onChange={(value) =>
              setDateRange((prev) => ({
                ...prev,
                from: value,
              }))
            }
          />
          <DateTimePicker
            label="To"
            value={dateRange.to}
            minDate={dateRange.from}
            maxDate={formatDate(new Date())}
            dateOnly={true}
            onChange={(value) =>
              setDateRange((prev) => ({
                ...prev,
                to: value,
              }))
            }
          />
        </div>
      )}
    </div>
  );
}
export default ReportsDateFilter;
