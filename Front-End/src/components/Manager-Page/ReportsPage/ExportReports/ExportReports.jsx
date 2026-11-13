import { useState } from "react";
import styles from "./exportReports.module.css";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import DateTimePicker from "../../../General/DateTimePicker/DateTimePicker";
import GeneralSelection from "../../../General/GeneralSelection/GeneralSelection";

const reportOptions = [
  { value: "", label: "Select report type" },
  { value: "users", label: "Users Report" },
  { value: "inventory", label: "Inventory Report" },
  { value: "orders", label: "Orders Report" },
  { value: "performance", label: "Sales Performance Report" },
];

function ExportReports() {
  const [reportType, setReportType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const today = new Date();

  const requiresDates = reportType === "inventory" || reportType === "orders";

  function handleExport() {
    if (!reportType) return;

    if (requiresDates && (!from || !to || from > to)) {
      setError("Please select a valid date range.");
      return;
    }

    setError("");

    const url = requiresDates
      ? `/api/manager/reports/${reportType}?from=${from}&to=${to}`
      : `/api/manager/reports/${reportType}`;

    window.location.href = url;
  }

  function handleFromChange(value) {
    setFrom(value);
    if (to && value && value > to) setTo("");
    setError("");
  }

  function handleToChange(value) {
    setTo(value);
    setError("");
  }
  return (
    <section className={styles.exportReports}>
      <div className={styles.header}>
        <h2>Export Reports</h2>
        <p>Generate and download reports in PDF format.</p>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>REPORT TYPE</label>

          <GeneralSelection
            value={reportType}
            options={reportOptions}
            onChange={(e) => {
              setReportType(e.target.value);
              setFrom("");
              setTo("");
              setError("");
            }}
          />
        </div>

        {requiresDates ? (
          <div className={styles.dateFields}>
            <DateTimePicker
              label="FROM"
              value={from}
              onChange={handleFromChange}
              maxDate={to || today}
              dateOnly
            />

            <DateTimePicker
              label="TO"
              value={to}
              onChange={handleToChange}
              minDate={from}
              maxDate={today}
              dateOnly
            />
          </div>
        ) : (
          <div className={styles.emptyDates}></div>
        )}

        <GeneralBtn
          text="DOWNLOAD PDF"
          type="button"
          onClick={handleExport}
          disabled={
            !reportType || (requiresDates && (!from || !to || from > to))
          }
          className={styles.exportBtn}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}

export default ExportReports;
