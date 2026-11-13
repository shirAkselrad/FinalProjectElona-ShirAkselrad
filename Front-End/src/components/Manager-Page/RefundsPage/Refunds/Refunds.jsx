import { useEffect, useState } from "react";
import OrdersTable from "../../../Employee-Page/OrdersPage/OrdersTable/OrdersTable";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import styles from "./refunds.module.css";

function Refunds() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const getPendingOrders = async () => {
      try {
        const [editsResponse, refundsResponse, ordersResponse] =
          await Promise.all([
            fetch("/api/manager/order/pendingEdits"),
            fetch("/api/manager/pendingRefunds"),
            fetch("/api/manager/orders?status=CANCELED"),
          ]);

        if (!editsResponse.ok || !refundsResponse.ok || !ordersResponse.ok) {
          throw new Error("Couldn't get pending refunds");
        }

        const editsData = await editsResponse.json();
        const refundsData = await refundsResponse.json();
        const ordersData = await ordersResponse.json();

        setPendingOrders(editsData.orders || []);

        // Get full order details for orders waiting for refund
        const pendingIds = refundsData.refunds.map((refund) =>
          String(refund.order_id),
        );

        const pendingCanceledOrders = ordersData.orders.filter((order) =>
          pendingIds.includes(String(order.order_id)),
        );

        setCanceledOrders(pendingCanceledOrders);
      } catch (error) {
        console.error("Couldn't get pending refunds:", error);

        setMessage({
          type: "error",
          text: "Couldn't load pending refund requests",
        });
      }
    };

    getPendingOrders();
  }, []);

  // Approve or reject product edits
  const handleEditDecision = async (orderId, action) => {
    try {
      const response = await fetch(`/api/manager/order/${orderId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Couldn't process order edit");
      }

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
      console.error("Couldn't process order edit:", error);

      setMessage({
        type: "error",
        text: "Couldn't process order edit",
      });

      return false;
    }
  };

  // Approve full order refund
  const handleRefund = async (orderId) => {
    try {
      const response = await fetch(
        `/api/manager/orders/${orderId}/approveRefund`,
        { method: "PUT" },
      );

      if (!response.ok) {
        throw new Error("Couldn't approve order refund");
      }

      setCanceledOrders((prev) =>
        prev.filter((order) => order.order_id !== orderId),
      );

      setMessage({
        type: "success",
        text: "Order refunded successfully",
      });

      return true;
    } catch (error) {
      console.error("Couldn't approve order refund:", error);

      setMessage({
        type: "error",
        text: "Couldn't approve order refund",
      });

      return false;
    }
  };

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

      <section>
        <h3>Pending Order Edits</h3>

        {pendingOrders.length === 0 ? (
          <p>No pending order edits</p>
        ) : (
          <OrdersTable
            orders={pendingOrders}
            onApprove={(orderId) => handleEditDecision(orderId, "approveEdit")}
            onReject={(orderId) => handleEditDecision(orderId, "rejectEdit")}
            isManager={true}
            isRefunds={true}
            refundType="edit"
          />
        )}
      </section>

      <section>
        <h3>Canceled Orders - Pending Refund</h3>

        {canceledOrders.length === 0 ? (
          <p>No canceled orders waiting for refund</p>
        ) : (
          <OrdersTable
            orders={canceledOrders}
            onApprove={handleRefund}
            isManager={true}
            isRefunds={true}
            refundType="canceled"
          />
        )}
      </section>
    </div>
  );
}

export default Refunds;
