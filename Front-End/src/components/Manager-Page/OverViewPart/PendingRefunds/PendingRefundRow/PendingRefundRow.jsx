import styles from "./pendingRefundRow.module.css";

function PendingRefundRow({ refund, approvingId, onApprove }) {
  return (
    <tr className={styles.row}>
      <td className={styles.orderId}>#{refund.order_id}</td>
      <td>{refund.client_email}</td>
      <td className={styles.points}>{refund.final_price}</td>
      <td className={styles.action}>
        <button
          className={styles.approveBtn}
          onClick={onApprove}
          disabled={approvingId !== null}
        >
          {approvingId === refund.order_id ? "Approving..." : "Approve Refund"}
        </button>
      </td>
    </tr>
  );
}

export default PendingRefundRow;
