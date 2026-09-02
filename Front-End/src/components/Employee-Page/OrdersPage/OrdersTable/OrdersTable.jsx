import styles from "./ordersTable.module.css";

import { useState } from "react";

import OrderRow from "../OrderRow/OrderRow.jsx";
import OrderPopupView from "../OrderPopupView-Window/OrderPopupView/OrderPopupView.jsx";
import OrderPopupEdit from "../OrderPopupEdit-Window/OrderPopupEdit/OrderPopupEdit.jsx";

/**
 *
 * @param {onSave}  onSave the even which will accure when the user will click on the save btn
 * @param {orders} orders which shown to the user
 * @returns OrdersTable
 */
function OrdersTable({ onSave, orders }) {
  //state variable which is the selectedOrder to have changes in, by default null
  const [selectedOrder, setSelectedOrder] = useState(null);

  //state variable which tells which order clicked to be change, by default false because none of the orders are clicked to be edited
  const [editOrder, setEditOrder] = useState(false);

  return (
    <div>
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
          {/*building the rows of the orders table, gets the onView even which will present the details of the current order */}
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onView={() => setSelectedOrder(order)}
            />
          ))}
        </tbody>
      </table>

      {/*In case the selectedOrder is not null and the editOrder btn wasn't clicked so the OrderPopupView is displayed, gets the selectedOrder, the onClose (which will close the popup by changing the selectedOrder to null ) and onEdit (open the option to edit in the popup) events  */}
      {selectedOrder && !editOrder && (
        <OrderPopupView
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onEdit={() => setEditOrder(true)}
        />
      )}

      {/*In case the selectedOrder is not null and the editOrder is clicked so the OrderPopupEdit is displayed gets the selectedOrder, onSave, onClose, onCancle (which will change the editOrder to be false ) events (which will close the popup by changing the selectedOrder to be null and the editOrder to be false) */}
      {selectedOrder && editOrder && (
        <OrderPopupEdit
          order={selectedOrder}
          onSave={onSave}
          onClose={() => {
            setSelectedOrder(null);
            setEditOrder(false);
          }}
          onCancel={() => setEditOrder(false)}
        />
      )}
    </div>
  );
}

export default OrdersTable;
