import styles from "./unshippedOrdersRow.module.css";
import Status from "../../../../Employee-Page/Status/Status.jsx";

function UnshippedOrdersRow({
  order,
  onStatusChange,
  openStatusOrderId,
  setOpenStatusOrderId,
  onView,
  isManager=false
}) {
  return (
    <tr className={styles.row}>
      <td className={styles.order}>{order.order_id}</td>

      <td>{`${order.first_name} ${order.last_name}`}</td>

      <td>{new Date(order.created_at).toLocaleDateString("en-GB")}</td>

      <td className={styles.total}>{order.final_price}₪</td>

      <td>{order.total_items}</td>

      <td>
        <div className={styles.actions}>
          <Status
            status={order.status}
            order_id={order.order_id}
            onStatusChange={onStatusChange}
            openStatusOrderId={openStatusOrderId}
            setOpenStatusOrderId={setOpenStatusOrderId}
            isManager={isManager}
          />

          <button
            type="button"
            className={styles.viewBtn}
            onClick={() => onView(order)}
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UnshippedOrdersRow;
