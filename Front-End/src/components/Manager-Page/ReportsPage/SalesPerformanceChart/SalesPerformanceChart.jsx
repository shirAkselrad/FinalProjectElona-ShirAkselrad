import { useState, useEffect } from "react";
import styles from "./salesPerformanceChart.module.css";
import GeneralSelection from "../../../General/GeneralSelection/GeneralSelection.jsx";
import GeneralRangeSlider from "../../../General/GeneralRangeSlider/GeneralRangeSlider.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function SalesPerformanceChart() {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //filters
  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [minDays, setMinDays] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  //filter options and slider limits from the BE
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [maxAvailableDays, setMaxAvailableDays] = useState(0);
  const [maxAvailableQuantity, setMaxAvailableQuantity] = useState(0);

  //getting sales performance according to filters
  useEffect(() => {
    const controller = new AbortController();

    async function getPerformanceData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/manager/salesPerformance?category=${category}&type=${type}&minDays=${minDays}&maxDays=${maxDays}&minQuantity=${minQuantity}&maxQuantity=${maxQuantity}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (!data.success) throw new Error("Couldn't get sales performance");

        setPerformanceData(data.performance || []);
        setCategories(data.categories || []);
        setTypes(data.types || []);
        setMaxAvailableDays(Number(data.maxAvailableDays || 0));
        setMaxAvailableQuantity(Number(data.maxAvailableQuantity || 0));
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Error getting sales performance:", err);
        setError("Couldn't load sales performance data.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    getPerformanceData();

    return () => controller.abort();
  }, [category, type, minDays, maxDays, minQuantity, maxQuantity]);

  //preparing results for Recharts
  const chartData = performanceData.map((product) => ({
    product_id: product.product_id,
    name: product.name,
    sold: Number(product.units_sold),
    target: Number(product.min_sales),
    performance: product.performance,
    achievement: product.achievement,
  }));

  //resetting all filters
  function resetFilters() {
    setCategory("All Categories");
    setType("All Types");
    setMinDays("");
    setMaxDays("");
    setMinQuantity("");
    setMaxQuantity("");
  }

  return (
    <div className={styles.performanceChart}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>PRODUCT SALES PERFORMANCE</h3>

        <p className={styles.chartSubtitle}>
          Units sold compared to sales targets
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.selectionGroup}>
          <label>Category</label>

          <GeneralSelection
            value={category}
            options={["All Categories", ...categories]}
            onChange={(e) => {
              setCategory(e.target.value);
              setType("All Types");
            }}
          />
        </div>

        <div className={styles.selectionGroup}>
          <label>Category Type</label>

          <GeneralSelection
            value={type}
            options={["All Types", ...types]}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div className={styles.rangeGroup}>
          <label>Sales Check Period</label>

          <GeneralRangeSlider
            min={0}
            max={maxAvailableDays}
            minValue={minDays}
            maxValue={maxDays}
            unit="days"
            onChange={({ minValue, maxValue }) => {
              setMinDays(minValue);
              setMaxDays(maxValue);
            }}
          />
        </div>

        <div className={styles.rangeGroup}>
          <label>Units Sold</label>

          <GeneralRangeSlider
            min={0}
            max={maxAvailableQuantity}
            minValue={minQuantity}
            maxValue={maxQuantity}
            unit="units"
            onChange={({ minValue, maxValue }) => {
              setMinQuantity(minValue);
              setMaxQuantity(maxValue);
            }}
          />
        </div>
      </div>

      <div className={styles.filterFooter}>
        <span>{performanceData.length} products</span>

        <button
          type="button"
          className={styles.resetBtn}
          onClick={resetFilters}
        >
          RESET FILTERS
        </button>
      </div>

      <div className={styles.chartContainer}>
        {loading ? (
          <p className={styles.noResults}>Loading performance data...</p>
        ) : error ? (
          <p className={styles.noResults}>{error}</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
            >
              <CartesianGrid stroke="#e8d7d2" strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={80}
                tick={{ fill: "#765563", fontSize: 10 }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#765563", fontSize: 11 }}
              />

              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toLocaleString("en-US")} units`,
                  name,
                ]}
              />

              <Legend verticalAlign="top" height={36} />

              <Bar
                dataKey="sold"
                name="Units Sold"
                fill="#4b1426"
                radius={[3, 3, 0, 0]}
              />

              <Bar
                dataKey="target"
                name="Sales Target"
                fill="#d8afa6"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.noResults}>No matching products found.</p>
        )}
      </div>
    </div>
  );
}

export default SalesPerformanceChart;
