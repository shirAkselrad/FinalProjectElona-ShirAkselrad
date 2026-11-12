import styles from "./salesByCategory.module.css";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function SalesByCategory() {
  const [salesData, setSalesData] = useState([]);

  async function getSalesByCategory() {
    try {
      const response = await fetch("/api/manager/salesByCategory", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status:${response.status}`);
      const data = await response.json();
      if (data.success) setSalesData(data.sales);
    } catch (error) {
      console.error("Error getting sales by category:", error);
    }
  }
  useEffect(() => {
    getSalesByCategory();
  }, []);

  //keep category colors consisten
  const sortedData = [...salesData].sort((a, b) =>
    a.category.localeCompare(b.category),
  );

  //main categories
  const categories = salesData.map((item) => ({
    name: item.category,
    value: item.sales,
  }));

  //category types-outer ring
  //category types - outer ring
  const types = salesData.flatMap((category, categoryIndex) =>
    category.types.map((type, typeIndex) => ({
      name: type.type,
      value: Number(type.sales),
      categoryIndex,
      typeIndex,
    })),
  );

  const totalSales = categories.reduce(
    (sum, category) => sum + category.value,
    0,
  );
  return (
    <div className={styles.salesByCategory}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>SALES BY CATEGORY</h3>
        <p className={styles.chartSubtitle}>
          Sales distribution by category and type
        </p>
      </div>

      <div className={styles.chartContainer}>
        {categories.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
              >
                {categories.map((category, index) => (
                  <Cell
                    key={category.name}
                    className={`${styles.innerSlice} ${
                      styles[`palette${index % 12}`]
                    }`}
                  />
                ))}
              </Pie>

              <Pie
                data={types}
                dataKey="value"
                nameKey="name"
                innerRadius={105}
                outerRadius={145}
                label={({ name, percent }) =>
                  percent >= 0.05 ? name.toUpperCase() : ""
                }
                labelLine={true}
              >
                {types.map((type, index) => (
                  <Cell
                    key={index}
                    className={`${styles.outerSlice} ${
                      styles[`palette${type.categoryIndex % 12}`]
                    } ${styles[`shade${type.typeIndex % 5}`]}`}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `₪${Number(value).toLocaleString("en-US")}`,
                  "Sales",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.noResults}>No sales data available.</p>
        )}
        {categories.length > 0 && (
          <div className={styles.chartCenter}>
            <span>TOTAL SALES</span>
            <strong>₪{totalSales.toLocaleString("en-US")}</strong>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        {categories.map((category, index) => (
          <div className={styles.legendItem} key={category.name}>
            <span
              className={`${styles.legendColor} ${
                styles[`palette${index % 12}`]
              }`}
            />
            <span>{category.name.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SalesByCategory;
