import styles from "./unshippedOrdersTable.module.css";

import UnshippedOrdersRow from "../UnshippedOrdersRow/UnshippedOrdersRow.jsx";

function UnshippedOrdersTable({
  orders,
  onStatusChange,
  openStatusOrderId,
  setOpenStatusOrderId,
  onView,
  onEdit,
  isManager=false
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
          <th>ACTIONS</th>
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
            onView={onView}
            onEdit={onEdit}
            isManager={isManager}
          />
        ))}
      </tbody>
    </table>
  );
}

export default UnshippedOrdersTable;
