import styles from "./lowStockRow.module.css";

import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";

function LowStockRow({ product, onEdit }) {
  const status = Number(product.quantity) === 0 ? "OUT OF STOCK" : "LOW STOCK";
  return (
    <tr className={styles.row}>
      <td className={styles.product}>{product.name}</td>

      <td>
        <span
          className={`${styles.status} ${
            status === "OUT OF STOCK" ? styles.outOfStock : styles.lowStock
          }`}
        >
          {status}
        </span>
      </td>

      <td className={styles.stock}>{product.quantity}</td>

      <td className={styles.edit}>
        <EditBtn onClick={onEdit} />
      </td>
    </tr>
  );
}

export default LowStockRow;
