import styles from "./generateReports.module.css";

import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";

function GenerateReports() {
  return (
    <div className={styles.generateReports}>
      <h2 className={styles.title}>Generate Report</h2>

      <p className={styles.text}>
        Select a report type and date range, then click{" "}
        <strong>Generate PDF</strong> to export the report.
      </p>

      <div className={styles.button}>
        <GeneralBtn text="GENERATE PDF REPORT" />
      </div>
    </div>
  );
}

export default GenerateReports;
