import styles from "./storeOverview.module.css";

import Title from "../../../General/Title/Title.jsx"
import OverviewLine from "../OverViewLine/OverViewLine.jsx"
import UnshippedOrders from "../UnshippedOrdersPart/UnshippedOrders/UnshippedOrders.jsx";
import LowStock from "../LowStockPart/LowStock/LowStock.jsx"

function StoreOverview({
  orders,
  clients,
  dates,
  totals,
  items,
  products,
  statuses,
  stocks,
}) {
  return (
    <div className={styles.storeOverview}>
      <Title text="Store Overview" />

      <div className={styles.overview}>
        <OverviewLine />
      </div>

      <div className={styles.unshippedOrders}>
        <UnshippedOrders
          orders={orders}
          clients={clients}
          dates={dates}
          totals={totals}
          items={items}
        />
      </div>

      <div className={styles.lowStock}>
        <LowStock products={products} statuses={statuses} stocks={stocks} />
      </div>
    </div>
  );
}

export default StoreOverview;
