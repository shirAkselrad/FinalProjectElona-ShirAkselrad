import styles from "./overViewLine.module.css";

import OverviewItem from "../OverViewItem/OverViewItem.jsx"
function OverviewLine() {
  return (
    <div className={styles.overviewLine}>
      <OverviewItem title="UNSHIPPED ORDERS" number={4} type="orange" />

      <OverviewItem title="OUT OF STOCK" number={1} type="red" />

      <OverviewItem title="LOW STOCK" number={2} type="orange" />

      <OverviewItem title="TOTAL PRODUCTS" number={12} type="brown" />
    </div>
  );
}

export default OverviewLine;
