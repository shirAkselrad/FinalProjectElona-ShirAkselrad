import styles from "./pendingRefundsTable.module.css";
import PendingRefundRow from "../PendingRefundRow/PendingRefundRow.jsx";

function PendingRefundsTable({ refunds, approvingId, onApprove }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ORDER ID</th>
          <th>CUSTOMER EMAIL</th>
          <th>POINTS TO REFUND</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {refunds.map((refund) => (
          <PendingRefundRow
            key={refund.order_id}
            refund={refund}
            approvingId={approvingId}
            onApprove={() => onApprove(refund.order_id)}
          />
        ))}
      </tbody>
    </table>
  );
}

export default PendingRefundsTable;
