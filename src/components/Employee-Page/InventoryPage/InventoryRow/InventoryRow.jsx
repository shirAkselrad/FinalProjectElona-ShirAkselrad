import styles from "./inventoryRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx"

function InventoryRow({ inventory }) {
  return (
    <tr className={styles.row}>
      <td>
        <div className={styles.product}>
          <img src={inventory.image} alt={inventory.name} />
          <span>{inventory.name}</span>
        </div>
      </td>

      <td>{inventory.category}</td>

      <td className={styles.price}>${inventory.price}</td>

      <td className={inventory.stock === 0 ? styles.outOfStock : ""}>
        {inventory.stock}
      </td>

      <td>
        <EditBtn />
      </td>
    </tr>
  );
}

export default InventoryRow;
