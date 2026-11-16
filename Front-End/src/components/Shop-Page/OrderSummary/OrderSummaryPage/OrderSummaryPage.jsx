import styles from "./orderSummaryPage.module.css";
import { useEffect, useState } from "react";
import OrderSummaryTable from "../OrderSummaryTable/OrderSummaryTable.jsx";
import OrderSummaryTotal from "../OrderSummaryTotal/OrderSummaryTotal.jsx";
import OrderSummaryClientDetails from "../OrderSummaryClientDetails/OrderSummaryClientDetails.jsx";
import { useNavigate } from "react-router-dom";

function OrderSummaryPage() {
  const navigate = useNavigate();
  const [client, setClient] = useState(null); //client details
  const [vatPercentage, setVatPercentage] = useState(null); //vat percentage
  //order details
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
    min_delivery_days: 0,
    max_delivery_days: 0,
  });

  // Get client's order
  async function getOrder() {
    //getting all the order summary including total_price (price before all tbe promotions and extras, final_price and all the order details )
    try {
      const response = await fetch("/api/orderSummary/getOrderSummary");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Error getting order summary:", error);
    }
  }

  // Get client details
  async function getClientDetails() {
    try {
      const response = await fetch("/api/client/getDetails");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setClient(data.client);
      }
    } catch (error) {
      console.error("Error getting client details:", error);
    }
  }

  // Get current VAT percentage
  async function getVatPercentage() {
    try {
      const response = await fetch("/api/shop/vatSettings");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Couldn't get VAT percentage");
      }

      setVatPercentage(Number(data.vat_percentage));
    } catch (error) {
      console.error("Error getting VAT percentage:", error);
    }
  }

  useEffect(() => {
    getOrder();
    getClientDetails();
    getVatPercentage();
  }, []);

  //if the user press on the payment button
  function handleContinueToPayment() {
    navigate("/payment");
  }

  //if the user press on the back to shop button
  function handleBackToShop() {
    navigate("/");
  }

  //according to the shipping settings calculating the dates the order suppost to be sent
  const calculateDeliveryDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className={styles.orderSummaryPage}>
      <h1>ORDER SUMMARY</h1>

      <OrderSummaryTable items={order.items} />

      <div className={styles.bottomSection}>
        <OrderSummaryTotal
          order={order}
          vatPercentage={vatPercentage}
          minDeliveryDate={calculateDeliveryDate(order.min_delivery_days)}
          maxDeliveryDate={calculateDeliveryDate(order.max_delivery_days)}
        />

        <div className={styles.clientSection}>
          {client && (
            <OrderSummaryClientDetails
              client={client}
              onSave={setClient}
              onContinue={handleContinueToPayment}
              onBack={handleBackToShop}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryPage;
