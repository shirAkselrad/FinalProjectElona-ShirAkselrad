import styles from "./unshippedOrders.module.css";

import AlertsTitle from "../../AlertsTitle/AlertsTitle.jsx";
import UnshippedOrdersTable from "../UnshippedOrdersTable/UnshippedOrdersTable.jsx";

function UnshippedOrders({
  orders,
  onStatusChange,
  openStatusOrderId,
  setOpenStatusOrderId,
  onView,
  onEdit,
  isManager=false
}) {
  return (
    <div className={styles.unshippedOrders}>
      <AlertsTitle text="UNSHIPPED ORDERS – AWAITING SHIPMENT" />

      <div className={styles.tableContainer}>
        <UnshippedOrdersTable
          orders={orders}
          onStatusChange={onStatusChange}
          openStatusOrderId={openStatusOrderId}
          setOpenStatusOrderId={setOpenStatusOrderId}
          onView={onView}
          onEdit={onEdit}
          isManager={isManager}
        />
      </div>
    </div>
  );
}

export default UnshippedOrders;
