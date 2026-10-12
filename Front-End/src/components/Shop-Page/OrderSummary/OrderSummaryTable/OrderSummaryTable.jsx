import styles from "./orderSummaryTable.module.css";
import OrderSummaryRow from "../OrderSummaryRow/OrderSummaryRow.jsx";

function OrderSummaryTable({ items }) {
  return (
    <div className={styles.orderSummaryTable}>
      <table>
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>PRODUCT NAME</th>
            <th>ORIGINAL PRICE</th>
            <th>SALE PRICE</th>
            <th>QUANTITY</th>
            <th>ORIGINAL TOTAL</th>
            <th>FINAL TOTAL</th>
          </tr>
        </thead>

        <tbody>
          {items.map((product) => (
            <OrderSummaryRow key={product.product_id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default OrderSummaryTable; 