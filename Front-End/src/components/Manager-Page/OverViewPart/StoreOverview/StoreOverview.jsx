import styles from "./storeOverview.module.css";
import { useState } from "react";
import Title from "../../../General/Title/Title.jsx";
import OverviewLine from "../OverViewLine/OverViewLine.jsx";
import UnshippedOrders from "../UnshippedOrdersPart/UnshippedOrders/UnshippedOrders.jsx";
import LowStock from "../LowStockPart/LowStock/LowStock.jsx";
import { useOutletContext } from "react-router-dom";
import EditInventoryPopup from "../../../Employee-Page/InventoryPage/EditInventoryPopup/EditInventoryPopup.jsx";
import OrderPopupEdit from "../../../Employee-Page/OrdersPage/OrderPopupEdit-Window/OrderPopupEdit/OrderPopupEdit.jsx";
import PromotionAlerts from "../PromotionAlerts/PromotionAlerts.jsx";
import PendingRefunds from "../PendingRefunds/PendingRefunds.jsx";

function StoreOverview() {
  const { inventory, onSave, managerOrders, setManagerOrders } =
    useOutletContext();
  const [openStatusOrderId, setOpenStatusOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refundRefresh, setRefundRefresh] = useState(0);

  const totalProducts = inventory.length;

  const onStatusChange = (order_id, newStatus) => {
    setManagerOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === order_id ? { ...order, status: newStatus } : order,
      ),
    );
    if (newStatus === "CANCELED") setRefundRefresh((prev) => prev + 1);
  };

  const outOfStock = inventory.filter(
    (product) =>
      Number(product.restock_required) === 1 && Number(product.quantity) === 0,
  );

  const lowStock = inventory.filter(
    (product) =>
      Number(product.restock_required) === 1 &&
      Number(product.quantity) > 0 &&
      Number(product.quantity) <= Number(product.min_stock),
  );

  const stockAlerts = [...outOfStock, ...lowStock];

  const unshippedOrders = managerOrders.filter(
    (order) => order.status === "PAID",
  );

  const onSaveOrder = (editedOrder) => {
    setManagerOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === editedOrder.order_id ? editedOrder : order,
      ),
    );
  };

  return (
    <div className={styles.storeOverview}>
      <Title text="Store Overview" />

      <div className={styles.overview}>
        <OverviewLine
          unshippedOrders={unshippedOrders.length}
          outOfStock={outOfStock.length}
          lowStock={lowStock.length}
          totalProducts={totalProducts}
        />
      </div>

      <div className={styles.unshippedOrders}>
        <UnshippedOrders
          orders={unshippedOrders}
          onStatusChange={onStatusChange}
          openStatusOrderId={openStatusOrderId}
          setOpenStatusOrderId={setOpenStatusOrderId}
        />
      </div>
      <div className={styles.pendingRefunds}>
        <PendingRefunds refundRefresh={refundRefresh} />
      </div>

      <div className={styles.lowStock}>
        <LowStock products={stockAlerts} onEdit={setSelectedProduct} />
      </div>
      <div>
        <PromotionAlerts />
      </div>
      {selectedProduct && (
        <EditInventoryPopup
          product={selectedProduct}
          isManager={true}
          onSave={onSave}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {selectedOrder && (
        <OrderPopupEdit
          order={selectedOrder}
          onSave={onSaveOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={() => setSelectedOrder(null)}
          isManager={true}
        />
      )}
    </div>
  );
}

export default StoreOverview;
