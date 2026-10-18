import styles from "./orderPopupTableView.module.css";
import OrderPopupRowView from "../OrderPopupRowView/OrderPopupRowView.jsx";

/**
 * Displays all products belonging to the selected order
 * @param {Array} products the products of the current order
 * @returns {JSX.Element}
 */
function OrderPopupTableView({ products }) {
  return (
    <div className={styles.orderPopupTable}>
      <div className={styles.header}>
        <span>PRODUCT ID</span>
        <span>PRODUCT NAME</span>
        <span>QTY</span>
        <span>UNIT PRICE</span>
        <span>TOTAL</span>
      </div>

      {products.map((product) => (
        <OrderPopupRowView key={product.product_id} product={product} />
      ))}
    </div>
  );
}

export default OrderPopupTableView;
