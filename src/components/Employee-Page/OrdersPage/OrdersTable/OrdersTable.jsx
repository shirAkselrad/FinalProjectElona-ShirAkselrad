import styles from "./ordersTable.module.css";

import { useState } from "react";

import OrderRow from "../OrderRow/OrderRow.jsx";
import OrderPopupView from "../OrderPopupView-Window/OrderPopupView/OrderPopupView.jsx";
import OrderPopupEdit from "../OrderPopupEdit-Window/OrderPopupEdit/OrderPopupEdit.jsx"

function OrdersTable({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(false);

  return (
    <>
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
            <OrderRow
              key={order.id}
              order={order}
              onView={() => setSelectedOrder(order)}
            />
          ))}
        </tbody>
      </table>

      {selectedOrder && !editOrder && (
        <OrderPopupView
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onEdit={() => setEditOrder(true)}
        />
      )}

      {selectedOrder && editOrder && (
        <OrderPopupEdit
          order={selectedOrder}
          onClose={() => {
            setSelectedOrder(null);
            setEditOrder(false);
          }}
          onCancel={() => setEditOrder(false)}
        />
      )}
    </>
  );
}

export default OrdersTable;
