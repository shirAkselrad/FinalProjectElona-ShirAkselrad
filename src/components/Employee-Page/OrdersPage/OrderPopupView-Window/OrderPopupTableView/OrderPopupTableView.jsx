import styles from "./orderPopupTableView.module.css";
import OrderPopupRowView from "../OrderPopupRowView/OrderPopupRowView.jsx";

function OrderPopupTableView({ products }) {
  return (
    <div className={styles.orderPopupTable}>
      <div className={styles.header}>
        <span>PRODUCT</span>
        <span>QTY</span>
        <span>UNIT PRICE</span>
        <span>TOTAL</span>
      </div>

      {products.map((product) => (
        <OrderPopupRowView key={product.id} order={product} />
      ))}
    </div>
  );
}

export default OrderPopupTableView;
