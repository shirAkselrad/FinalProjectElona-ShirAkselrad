import { useState, useEffect } from "react";
import styles from "./pendingRefunds.module.css";
import PendingRefundsTable from "./PendingRefundsTable/PendingRefundsTable.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import AlertsTitle from "../AlertsTitle/AlertsTitle.jsx";
function PendingRefunds({ refundRefresh }) {
  const [refunds, setRefunds] = useState([]);
  const [approvingId, setApprovingId] = useState(null);
  const [message, setMessage] = useState(null);

  const getPendingRefunds = async () => {
    try {
      const response = await fetch("/api/manager/pendingRefunds", {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) setRefunds(data.refunds);
    } catch (error) {
      console.error("Couldn't get pending refunds:", error);
      setMessage({
        type: "error",
        text: "Couldn't load pending refunds.",
      });
    }
  };

  useEffect(() => {
    getPendingRefunds();
  }, [refundRefresh]);

  const approveRefund = async (order_id) => {
    setApprovingId(order_id);

    try {
      const response = await fetch(
        `/api/manager/orders/${order_id}/approveRefund`,
        { method: "PUT" },
      );

      const data = await response.json();

      if (!response.ok || !data.success)
        throw new Error(data.message || "Couldn't approve refund");

      setRefunds((prev) =>
        prev.filter((refund) => refund.order_id !== order_id),
      );

      setMessage({
        type: "success",
        text: "Points have been refunded successfully!",
      });
    } catch (error) {
      console.error("Couldn't approve refund:", error);
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className={styles.pendingRefunds}>
      {refunds.length > 0 && (
        <>
          <AlertsTitle text="PENDING REFUNDS – APPROVAL REQUIRED" />

          <div className={styles.tableContainer}>
            <PendingRefundsTable
              refunds={refunds}
              approvingId={approvingId}
              onApprove={approveRefund}
            />
          </div>
        </>
      )}

      {message && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          autoClose={message.type === "success"}
        />
      )}
    </div>
  );
}

export default PendingRefunds;
