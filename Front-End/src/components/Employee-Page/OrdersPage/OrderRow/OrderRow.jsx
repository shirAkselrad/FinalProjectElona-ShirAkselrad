import styles from "./orderRow.module.css";

import Status from "../../Status/Status.jsx";
import ViewBtn from "../../../General/ViewBtn/ViewBtn.jsx";

/**
 *
 * @param {order} order the current order in the row
 * @param {onView} oView the event which happenes when the user click on the view btn
 * @returns OrderRow
 */
function OrderRow({
  order,
  onView,
  onStatusChange,
  openStatusOrderId,
  setOpenStatusOrderId,
  isManager=false
}) {
  return (
    <tr className={styles.row}>
      <td className={styles.order}>{order.order_id}</td>

      <td>{`${order.first_name} ${order.last_name}`}</td>

      <td>{order.client_email}</td>

      <td className={styles.items}>{order.total_items}</td>

      <td>{new Date(order.created_at).toLocaleDateString("en-GB")}</td>

      <td className={styles.total}>{Number(order.final_price).toFixed(2)}₪</td>

      <td>
        <Status
          status={order.status}
          order_id={order.order_id}
          onStatusChange={onStatusChange}
          openStatusOrderId={openStatusOrderId}
          setOpenStatusOrderId={setOpenStatusOrderId}
          isManager={isManager}
        />
      </td>

      <td>
        <ViewBtn onClick={onView} />
      </td>
    </tr>
  );
}

export default OrderRow;
