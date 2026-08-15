import styles from "./orderRow.module.css";

import Status from "../Status/Status.jsx";
import ViewBtn from "../ViewBtn/ViewBtn.jsx";

function OrderRow({ order, client, items, date, total, status }) {
  return (
    <tr className={styles.row}>
      <td className={styles.order}>{order}</td>
      <td>{client}</td>
      <td className={styles.items}>{items}</td>
      <td>{date}</td>
      <td className={styles.total}>${total}</td>
      <td>
        <Status status={status} />
      </td>
      <td>
        <ViewBtn />
      </td>
    </tr>
  );
}

export default OrderRow;
