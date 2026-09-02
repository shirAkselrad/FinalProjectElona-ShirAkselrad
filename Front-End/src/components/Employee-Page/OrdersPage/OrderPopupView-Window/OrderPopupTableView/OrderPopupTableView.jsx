import styles from "./orderPopupTableView.module.css";
import OrderPopupRowView from "../OrderPopupRowView/OrderPopupRowView.jsx";
/**
 *
 * @param {products} products of the current order
 * @returns OrderPopupTableView
 */
function OrderPopupTableView({ products }) {
  return (
    <div className={styles.orderPopupTable}>
      <div className={styles.header}>
        <span>PRODUCT</span>
        <span>QTY</span>
        <span>UNIT PRICE</span>
        <span>TOTAL</span>
      </div>

      {/*building the rows of the products table, gets the product  */}
      {products.map((product) => (
        <OrderPopupRowView key={product.id} product={product} />
      ))}
    </div>
  );
}

export default OrderPopupTableView;
