import styles from "./ordersTable.module.css";

import OrderRow from "../OrderRow/OrderRow.jsx"

function OrdersTable({ orders, clients, items, dates, totals, statuses }) {
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
        {orders.map((order, i) => (
          <OrderRow
            key={i}
            order={order}
            client={clients[i]}
            items={items[i]}
            date={dates[i]}
            total={totals[i]}
            status={statuses[i]}
          />
        ))}
      </tbody>
    </table>
  );
}

export default OrdersTable;
