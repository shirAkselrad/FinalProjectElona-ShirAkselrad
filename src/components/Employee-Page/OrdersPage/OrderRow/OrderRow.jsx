import styles from "./orderRow.module.css";

import Status from "../../Status/Status.jsx";
import ViewBtn from "../../../General/ViewBtn/ViewBtn.jsx";

/**
 *
 * @param {order} order the current order in the row
 * @param {onView} oView the event which happenes when the user click on the view btn
 * @returns OrderRow
 */
function OrderRow({ order, onView }) {
  return (
    <tr className={styles.row}>
      <td className={styles.order}>{order.id}</td>

      <td>{order.client}</td>

      <td className={styles.items}>{order.items}</td>

      <td>{order.date}</td>

      <td className={styles.total}>${order.total}</td>

      <td>
        <Status status={order.status} />
      </td>

      <td>
        {/*operates the onView function, which makes the OrderPopupView present */}
        <ViewBtn onClick={onView} />
      </td>
    </tr>
  );
}

export default OrderRow;
