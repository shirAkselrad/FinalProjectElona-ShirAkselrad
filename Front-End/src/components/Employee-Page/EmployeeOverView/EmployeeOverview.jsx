import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./employeeOverview.module.css";
import Title from "../../General/Title/Title.jsx";
import UnshippedOrders from "../../Manager-Page/OverViewPart/UnshippedOrdersPart/UnshippedOrders/UnshippedOrders.jsx";
import OrderPopupView from "../OrdersPage/OrderPopupView-Window/OrderPopupView/OrderPopupView.jsx";
import OrderPopupEdit from "../OrdersPage/OrderPopupEdit-Window/OrderPopupEdit/OrderPopupEdit.jsx";

function EmployeeOverview() {
  const { orders, setOrders } = useOutletContext();

  const [viewOrder, setViewOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStatusOrderId, setOpenStatusOrderId] = useState(null);

  //gettings all the orders which haven't sent yet
  const unshippedOrders = orders.filter((order) => order.status === "PAID");

  //updating orders if order status had changed
  const onStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        Number(order.order_id) === Number(orderId)
          ? { ...order, status: newStatus }
          : order,
      ),
    );
  };

  //updating orders in case one of the orders details had changed
  const onSaveOrder = (editedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === editedOrder.order_id
          ? { ...order, ...editedOrder }
          : order,
      ),
    );
  };

  return (
    <div className={styles.employeeOverview}>
      <Title text="Employee Overview" />

      <UnshippedOrders
        orders={unshippedOrders}
        onStatusChange={onStatusChange}
        openStatusOrderId={openStatusOrderId}
        setOpenStatusOrderId={setOpenStatusOrderId}
        onView={setViewOrder}
        isManager={false}
      />

      {viewOrder && (
        <OrderPopupView
          order={viewOrder}
          isManager={false}
          onClose={() => setViewOrder(null)}
          onEdit={() => {
            setSelectedOrder(viewOrder);
            setViewOrder(null);
          }}
        />
      )}

      {selectedOrder && (
        <OrderPopupEdit
          order={selectedOrder}
          isManager={false}
          onSave={onSaveOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default EmployeeOverview;
