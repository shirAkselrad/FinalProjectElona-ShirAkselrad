import styles from "./orderPopupView.module.css";
import OrderPopupTitleView from "../OrderPopupTitleView/OrderPopupTitleView.jsx";
import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";
import OrderPopupTableView from "../OrderPopupTableView/OrderPopupTableView.jsx";
import OrderPopupSumarryView from "../OrderPopupSumarryView/OrderPopupSumarryView.jsx";

function OrderPopupView({ order, onClose, onEdit }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitleView
            orderNumber={order.id}
            customerName={order.client}
            date={order.date}
          />

          <div className={styles.actions}>
            <EditBtn onClick={onEdit} className={styles.popupEdit} />
            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        <OrderPopupTableView products={order.products} />

        <OrderPopupSumarryView total={order.total} />
      </div>
    </div>
  );
}

export default OrderPopupView;
