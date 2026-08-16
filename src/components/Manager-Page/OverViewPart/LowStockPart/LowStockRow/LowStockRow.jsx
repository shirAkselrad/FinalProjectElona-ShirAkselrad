import styles from "./lowStockRow.module.css";

import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";

function LowStockRow({ product, status, stock }) {
  return (
    <tr className={styles.row}>
      <td className={styles.product}>{product}</td>

      <td>
        <span
          className={`${styles.status} ${
            status === "OUT OF STOCK" ? styles.outOfStock : styles.lowStock
          }`}
        >
          {status}
        </span>
      </td>

      <td className={styles.stock}>{stock}</td>

      <td className={styles.edit}>
        <EditBtn />
      </td>
    </tr>
  );
}

export default LowStockRow;
