import styles from "./unshippedOrders.module.css";

import AlertsTitle from "../../AlertsTitle/AlertsTitle.jsx";
import UnshippedOrdersTable from "../UnshippedOrdersTable/UnshippedOrdersTable.jsx";

function UnshippedOrders({ orders, clients, dates, totals, items }) {
  return (
    <div className={styles.unshippedOrders}>
      <AlertsTitle text="UNSHIPPED ORDERS – AWAITING SHIPMENT" />

      <div className={styles.tableContainer}>
        <UnshippedOrdersTable
          orders={orders}
          clients={clients}
          dates={dates}
          totals={totals}
          items={items}
        />
      </div>
    </div>
  );
}

export default UnshippedOrders;
