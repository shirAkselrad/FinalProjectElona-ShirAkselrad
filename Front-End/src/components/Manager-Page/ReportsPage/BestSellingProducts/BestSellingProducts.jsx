import styles from "./bestSellingProducts.module.css";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BestSellingProducts() {
  const [products, setProducts] = useState([]);
  async function getBestSellingProducts() {
    try {
      const response = await fetch("/api/manager/bestSellingProducts", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error getting best selling products:", error);
    }
  }

  useEffect(()=>{
    getBestSellingProducts();
  },[]);

      return (
        <div className={styles.bestSellingProducts}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>BEST SELLING PRODUCTS</h3>
            <p className={styles.chartSubtitle}>
              Top 10 products by units sold
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