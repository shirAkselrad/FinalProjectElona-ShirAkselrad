import styles from "./reports.module.css";
import ExportReports from "../ExportReports/ExportReports";
import SalesCharts from "../SalesChart/SalesChart";
import SalesByCategory from "../SalesByCategory/SalesByCategory";
import SectionTitle from "../../../Employee-Page/SectionTitle/SectionTitle";
import BestSellingProducts from "../BestSellingProducts/BestSellingProducts";
import OrderByStatus from "../OrdersByStatus/OrdersByStatus";

function Reports() {
  return (
    <div className={styles.reports}>
      <SectionTitle title="Reports & Analytics" />
      <ExportReports />

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <SalesCharts />
        </div>

        <div className={styles.chartCard}>
          <SalesByCategory />
        </div>

        <div className={styles.chartCard}>
          <BestSellingProducts />
        </div>

        <div className={styles.chartCard}>
          <OrderByStatus />
        </div>
      </div>
    </div>
  );
}

export default Reports;
