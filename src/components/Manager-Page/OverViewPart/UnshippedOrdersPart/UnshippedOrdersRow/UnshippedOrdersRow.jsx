import styles from "./unshippedOrdersRow.module.css";

import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";

function UnshippedOrdersRow({ order, client, date, total, items }) {
  return (
    <tr className={styles.row}>
      <td className={styles.order}>{order}</td>

      <td>{client}</td>

      <td>{date}</td>

      <td className={styles.total}>${total}</td>

      <td>{items}</td>

      <td className={styles.edit}>
        <EditBtn />
      </td>
    </tr>
  );
}

export default UnshippedOrdersRow;
