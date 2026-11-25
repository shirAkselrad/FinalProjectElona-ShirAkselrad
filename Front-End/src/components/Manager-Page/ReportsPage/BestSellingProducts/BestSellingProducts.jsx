import styles from "./bestSellingProducts.module.css";
import { useState, useEffect } from "react";
import {
  BarChart, //graph type
  Bar, //set the bars
  XAxis, //X
  YAxis, //Y
  CartesianGrid, //grid lines
  Tooltip, //present data on the graph
  ResponsiveContainer, //fit the size of the graph
} from "recharts";

function BestSellingProducts({ dateRange }) {
  const [products, setProducts] = useState([]);
  const { from, to } = dateRange;

  //gettings the 10 best selling products (names and amount)
  async function getBestSellingProducts() {
    try {
      const response = await fetch(
        `/api/manager/bestSellingProducts?from=${from}&to=${to}`,
        {
          method: "GET",
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error getting best selling products:", error);
    }
  }

  useEffect(() => {
    getBestSellingProducts();
  }, [from, to]);

  return (
    <div className={styles.bestSellingProducts}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>BEST SELLING PRODUCTS</h3>
        <p className={styles.chartSubtitle}>
          Top 10 products by units sold over the selected period
        </p>
      </div>

      <div className={styles.chartContainer}>
        {products.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products} layout="vertical">
              <CartesianGrid className={styles.chartGrid} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="product" width={150} />
              <Tooltip />
              <Bar
                dataKey="quantity"
                name="Units Sold"
                className={styles.salesBar}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.noResults}>No sales data available.</p>
        )}
      </div>
    </div>
  );
}

export default BestSellingProducts;
