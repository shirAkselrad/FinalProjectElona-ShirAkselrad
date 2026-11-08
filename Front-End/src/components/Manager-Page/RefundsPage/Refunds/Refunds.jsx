import { useEffect, useState } from "react";
import OrdersTable from "../../../Employee-Page/OrdersPage/OrdersTable/OrdersTable";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import styles from "./refunds.module.css";

function Refunds() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const getPendingOrders = async () => {
      try {
        const response = await fetch("/api/manager/order/pendingEdits", {
          method: "GET",
        });
        if (!response.ok) throw new Error("Couldn't get pending order edits");
        const data = await response.json();
        setPendingOrders(data.orders);
      } catch (error) {
        console.error("Couldn't get pending order edits: ", error);
      }
    };
    getPendingOrders();
  }, []);

  const handleDecision = async (orderId, action) => {
    try {
      const response = await fetch(`/api/manager/order/${orderId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Couldn't process refund request");

      setPendingOrders((prev) =>
        prev.filter((order) => order.order_id !== orderId),
      );

      setMessage({
        type: "success",
        text:
          action === "approveEdit"
            ? "Order edit approved successfully"
            : "Order edit rejected successfully",
      });

      return true;
    } catch (error) {
      console.error("Couldn't process refund request:", error);

      setMessage({
        type: "error",
        text: "Couldn't process refund request",
      });

      return false;
    }
  };

  const onApprove = (orderId) => handleDecision(orderId, "approveEdit");

  const onReject = (orderId) => handleDecision(orderId, "rejectEdit");

  return (
    <div className={styles.refunds}>
      <h2>Refunds</h2>

      {message && (
        <MessagePopup
          message={message.text}
          type={message.type}
          autoClose={false}
          onClose={() => setMessage(null)}
        />
      )}

      {pendingOrders.length === 0 ? (
        <p>No pending refund requests</p>
      ) : (
        <OrdersTable
          orders={pendingOrders}
          onApprove={onApprove}
          onReject={onReject}
          isManager={true}
          isRefunds={true}
        />
      )}
    </div>
  );
}
export default Refunds;
