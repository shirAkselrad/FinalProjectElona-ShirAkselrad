import styles from "./orderSummaryPage.module.css";
import { useEffect, useState } from "react";
import OrderSummaryTable from "../OrderSummaryTable/OrderSummaryTable.jsx";
import OrderSummaryTotal from "../OrderSummaryTotal/OrderSummaryTotal.jsx";
import OrderSummaryClientDetails from "../OrderSummaryClientDetails/OrderSummaryClientDetails.jsx";
import { useNavigate } from "react-router-dom";

function OrderSummaryPage() {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
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
    final_price: 0,
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

  async function getClientDetails() {
    try {
      const response = await fetch("/api/client/getDetails", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) setClient(data.client);
    } catch (error) {
      console.error("Error getting clients details:", error);
    }
  }

  useEffect(() => {
    getOrder();
    getClientDetails();
  }, []);

  function handleContinueToPayment() {
    navigate("/payment");
  }
  return (
    <div className={styles.orderSummaryPage}>
      <h1>ORDER SUMMARY</h1>

      <OrderSummaryTable items={order.items} />

      <div className={styles.bottomSection}>
        <OrderSummaryTotal order={order} />

        {client && (
          <OrderSummaryClientDetails
            client={client}
            onSave={setClient}
            onContinue={handleContinueToPayment}
          />
        )}
      </div>
    </div>
  );
}
export default OrderSummaryPage;
