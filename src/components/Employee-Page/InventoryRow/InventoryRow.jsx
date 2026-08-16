import styles from "./inventoryRow.module.css";

import EditBtn from "../../General/EditBtn/EditBtn.jsx";

function InventoryRow({ image, product, category, price, stock }) {
  return (
    <tr className={styles.row}>
      <td>
        <div className={styles.product}>
          <img src={image} alt={product} />
          <span>{product}</span>
        </div>
      </td>

      <td>{category}</td>

      <td className={styles.price}>${price}</td>

      <td className={stock === 0 ? styles.outOfStock : ""}>{stock}</td>

      <td>
        <EditBtn />
      </td>
    </tr>
  );
}

export default InventoryRow;
