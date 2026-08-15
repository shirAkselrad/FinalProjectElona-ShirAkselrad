import styles from "./orders.module.css";

import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../SectionTitle/SectionTitle.jsx";

function Orders({ orders, clients, items, dates, totals, statuses }) {
  return (
    <div className={styles.orders}>
      <SectionTitle title="Orders" />

      <div className={styles.tableContainer}>
        <OrdersTable
          orders={orders}
          clients={clients}
          items={items}
          dates={dates}
          totals={totals}
          statuses={statuses}
        />
      </div>
    </div>
  );
}

export default Orders;
