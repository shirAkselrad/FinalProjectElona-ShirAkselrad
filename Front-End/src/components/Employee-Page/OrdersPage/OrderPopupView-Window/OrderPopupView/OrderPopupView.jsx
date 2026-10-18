import styles from "./orderPopupView.module.css";
import OrderPopupTitleView from "../OrderPopupTitleView/OrderPopupTitleView.jsx";
import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";
import OrderPopupTableView from "../OrderPopupTableView/OrderPopupTableView.jsx";
import OrderPopupSumarryView from "../OrderPopupSumarryView/OrderPopupSumarryView.jsx";
import { useEffect, useState } from "react";
/**
 *
 * @param {order} order the currrent order to be view in the popup
 * @param {onClose} onClose the event which accurs when the user click on the x btn
 * @param {onEdit} onEdit the event which accurs when the user click on the edit btn
 * @returns OrderPopupView
 */
function OrderPopupView({ order, onClose, onEdit }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getOrderProducts = async () => {
      try {
        const response = await fetch(
          `/api/employee/orders/${order.order_id}/items`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!response.ok) throw new Error("Couldn't get order's products");
        const data = await response.json();
        console.log("Order ID:", order.order_id);
        console.log("Products from backend:", data.products);

        setProducts(data.products);
      } catch (error) {
        console.error("Couldn't get order products: ", error);
      }
    };
    getOrderProducts();
  }, [order.order_id]);
  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitleView
            orderId={order.order_id}
            customerName={`${order.first_name} ${order.last_name}`}
            date={new Date(order.created_at).toLocaleDateString("en-GB")}
          />

          <div className={styles.actions}>
            {/*gets the onEdit function to oprate when clicked */}
            <EditBtn onClick={onEdit} className={styles.popupEdit} />
            {/*gets the onClose function to oprate when clicked */}
            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        {/*the table of all the products in the order, gets the order's products  */}
        <OrderPopupTableView products={products} />

        <OrderPopupSumarryView total={order.final_price} />
      </div>
    </div>
  );
}

export default OrderPopupView;
