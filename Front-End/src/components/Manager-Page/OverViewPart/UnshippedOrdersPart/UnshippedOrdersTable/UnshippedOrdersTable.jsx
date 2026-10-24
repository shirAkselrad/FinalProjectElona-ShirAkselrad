import styles from "./unshippedOrdersTable.module.css";

import UnshippedOrdersRow from "../UnshippedOrdersRow/UnshippedOrdersRow.jsx";

function UnshippedOrdersTable({
  orders,
  onStatusChange,
  openStatusOrderId,
  setOpenStatusOrderId,
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ORDER</th>
          <th>CLIENT</th>
          <th>DATE</th>
          <th>TOTAL</th>
          <th>ITEMS</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <UnshippedOrdersRow
            key={order.order_id}
            order={order}
            onStatusChange={onStatusChange}
            openStatusOrderId={openStatusOrderId}
            setOpenStatusOrderId={setOpenStatusOrderId}
          />
        ))}
      </tbody>
    </table>
  );
}

export default UnshippedOrdersTable;
