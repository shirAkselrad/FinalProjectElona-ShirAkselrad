import styles from "./orderPopupTable.module.css";
import OrderPopupRow from "../OrderPopupRow/OrderPopupRow.jsx";

function OrderPopupTable({ products }) {
  return (
    <div className={styles.orderPopupTable}>
      <div className={styles.header}>
        <span>PRODUCT</span>
        <span>QTY</span>
        <span>UNIT PRICE</span>
        <span>TOTAL</span>
      </div>

      {products.map((product) => (
        <OrderPopupRow key={product.id} order={product} />
      ))}
    </div>
  );
}

export default OrderPopupTable;
