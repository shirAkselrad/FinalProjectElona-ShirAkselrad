import styles from "./ordersTable.module.css";

import OrderRow from "../OrderRow/OrderRow.jsx";

function OrdersTable({ orders }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Order</th>
          <th>Client</th>
          <th>Items</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </tbody>
    </table>
  );
}

export default OrdersTable;
