import styles from "./ordersByStatus.module.css";
import { useState, useEffect } from "react";
import { PieChart, Cell, Pie, Tooltip, ResponsiveContainer } from "recharts";

function OrderByStatus() {
  const [ordersData, setOrdersData] = useState([]);

  async function getOrdersByStatus() {
    try {
      const response = await fetch("/api/manager/ordersByStatus", {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success)
        setOrdersData(
          data.orders.map((item) => ({
            status: item.status,
            orders: Number(item.orders),
          })),
        );
    } catch (error) {
      console.error("Error getting orders by status:", error);
    }
  }

  useEffect(() => {
    getOrdersByStatus();
  }, []);

  const totalOrders = ordersData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className={styles.ordersByStatus}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>ORDERS BY STATUS</h3>
        <p className={styles.chartSubtitle}>
          Order distribution by current status
        </p>
      </div>

      <div className={styles.chartContainer}>
        {ordersData.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersData}
                  dataKey="orders"
                  nameKey="status"
                  innerRadius={75}
                  outerRadius={135}
                  label={({ status, percent }) =>
                    `${status} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {ordersData.map((item) => (
                    <Cell
                      key={item.status}
                      className={`${styles.statusSlice} ${
                        styles[item.status.toLowerCase()] || styles.other
                      }`}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.chartCenter}>
              <span>TOTAL ORDERS</span>
              <strong>{totalOrders}</strong>
            </div>
          </div>
        ) : (
          <p className={styles.noResults}>No orders data available.</p>
        )}
      </div>

      <div className={styles.legend}>
        {ordersData.map((item) => (
          <div className={styles.legendItem} key={item.status}>
            <span
              className={`${styles.legendColor} ${
                styles[item.status.toLowerCase()] || styles.other
              }`}
            />
            <span>{item.status}</span>
            <strong>{item.orders}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderByStatus;
