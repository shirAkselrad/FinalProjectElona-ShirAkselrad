import styles from "./reports.module.css";
import ExportReports from "../ExportReports/ExportReports";
import SalesCharts from "../SalesChart/SalesChart";
import SalesByCategory from "../SalesByCategory/SalesByCategory";
import SectionTitle from "../../../Employee-Page/SectionTitle/SectionTitle";
import BestSellingProducts from "../BestSellingProducts/BestSellingProducts";
import OrderByStatus from "../OrdersByStatus/OrdersByStatus";
import SalesPerformanceChart from "../SalesPerformanceChart/SalesPerformanceChart";
import ReportsDateFilter from "../ReportsDateFilter/ReportsDateFilter";
import { useState } from "react";


function getDefaultPeriod() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 30);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return { from: formatDate(from), to: formatDate(to) };
}
function Reports() {
  const [dateRange, setDateRange] = useState(getDefaultPeriod);
  return (
    <div className={styles.reports}>
      <SectionTitle title="Reports & Analytics" />

      <ExportReports />

      <div className={styles.analyticsSection}>
        <div className={styles.analyticsHeader}>
          <h2>Sales & Order Analytics</h2>
          <p>Monitor store sales and order activity over time.</p>
        </div>

        <ReportsDateFilter dateRange={dateRange} setDateRange={setDateRange} />

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <SalesCharts dateRange={dateRange} />
          </div>

          <div className={styles.chartCard}>
            <SalesByCategory dateRange={dateRange} />
          </div>

          <div className={styles.chartCard}>
            <BestSellingProducts dateRange={dateRange} />
          </div>

          <div className={styles.chartCard}>
            <OrderByStatus dateRange={dateRange} />
          </div>
        </div>
      </div>

      <div className={styles.performanceSection}>
        <SalesPerformanceChart />
      </div>
    </div>
  );
}

export default Reports;
