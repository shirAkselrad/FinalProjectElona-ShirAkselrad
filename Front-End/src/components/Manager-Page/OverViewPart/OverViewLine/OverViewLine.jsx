import styles from "./overViewLine.module.css";

import OverviewItem from "../OverViewItem/OverViewItem.jsx";
function OverviewLine({
  unshippedOrders,
  outOfStock,
  lowStock,
  totalProducts,
}) {
  return (
    <div className={styles.overviewLine}>
      <OverviewItem
        title="UNSHIPPED ORDERS"
        number={unshippedOrders}
        type="orange"
      />

      <OverviewItem title="OUT OF STOCK" number={outOfStock} type="red" />

      <OverviewItem title="LOW STOCK" number={lowStock} type="orange" />

      <OverviewItem
        title="TOTAL PRODUCTS"
        number={totalProducts}
        type="brown"
      />
    </div>
  );
}

export default OverviewLine;
