import styles from "./salesChart.module.css";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SalesChart() {
  const [salesData, setSalesData] = useState([]);

  async function getSalesData() {
    try {
      const response = await fetch("/api/manager/salesChart", {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success)
        setSalesData(
          data.sales.map((item) => ({
            month: item.month,
            sales: Number(item.sales),
          })),
        );
    } catch (error) {
      console.error("Error getting sales data:", error);
    }
  }

  useEffect(() => {
    getSalesData();
  }, []);

  return (
    <div className={styles.salesChart}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>SALES OVER TIME</h3>
        <p className={styles.chartSubtitle}>Monthly sales performance</p>
      </div>

      <div className={styles.chartContainer}>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid
                className={styles.chartGrid}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                className={styles.chartAxis}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                className={styles.chartAxis}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `₪${Number(value).toLocaleString("en-US")}`,
                  "Sales",
                ]}
              />

              <Line
                type="monotone"
                dataKey="sales"
                className={styles.salesLine}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.noResults}>No sales data available.</p>
        )}
      </div>
    </div>
  );
}

export default SalesChart;
