import styles from "./unshippedOrdersTable.module.css";

import UnshippedOrdersRow from "../UnshippedOrdersRow/UnshippedOrdersRow.jsx";

function UnshippedOrdersTable({ orders, clients, dates, totals, items }) {
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
        {orders.map((order, i) => (
          <UnshippedOrdersRow
            key={i}
            order={order}
            client={clients[i]}
            date={dates[i]}
            total={totals[i]}
            items={items[i]}
          />
        ))}
      </tbody>
    </table>
  );
}

export default UnshippedOrdersTable;
