import styles from "./orderPopupView.module.css";
import OrderPopupTitleView from "../OrderPopupTitleView/OrderPopupTitleView.jsx";
import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";
import OrderPopupTableView from "../OrderPopupTableView/OrderPopupTableView.jsx";
import OrderPopupSumarryView from "../OrderPopupSumarryView/OrderPopupSumarryView.jsx";

/**
 *
 * @param {order} order the currrent order to be view in the popup
 * @param {onClose} onClose the event which accurs when the user click on the x btn
 * @param {onEdit} onEdit the event which accurs when the user click on the edit btn
 * @returns OrderPopupView
 */
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
            {/*gets the onEdit function to oprate when clicked */}
            <EditBtn onClick={onEdit} className={styles.popupEdit} />
            {/*gets the onClose function to oprate when clicked */}
            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        {/*the table of all the products in the order, gets the order's products  */}
        <OrderPopupTableView products={order.products} />

        <OrderPopupSumarryView total={order.total} />
      </div>
    </div>
  );
}

export default OrderPopupView;
