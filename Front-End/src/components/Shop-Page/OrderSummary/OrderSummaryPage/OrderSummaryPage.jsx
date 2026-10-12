import styles from "./orderSummaryPage.module.css";
import { useEffect, useState } from "react";
import OrderSummaryTable from "../OrderSummaryTable/OrderSummaryTable.jsx";
import OrderSummaryTotal from "../OrderSummaryTotal/OrderSummaryTotal.jsx";

function OrderSummaryPage() {
  const [order, setOrder] = useState({
    order_id: null,
    items: [],
    total_items: 0,
    original_total: 0,
    promotions_discount: 0,
    total_after_promotions: 0,
    available_points: 0,
    points_used: 0,
    shipping: 0,
    final_total: 0,
  });

  //This function gets client's order from the data base
  async function getOrder() {
    try {
      const response = await fetch("/api/cart/getOrderSummary", {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Error getting order summary: ", error);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className={styles.orderSummaryPage}>
      <h1>ORDER SUMMARY</h1>
      <OrderSummaryTable items={order.items} />
      <OrderSummaryTotal order={order} />
    </div>
  );
}
export default OrderSummaryPage;
