import styles from "./orderPopup.module.css";

import OrderPopupTitle from "../OrderPopupTitle/OrderPopupTitle.jsx";
import OrderPopupTable from "../OrderPopupTable/OrderPopupTable.jsx";
import OrderPopupSumarry from "../OrderPopupSumarry/OrderPopupSumarry.jsx";

import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";

function OrderPopup() {
  const products = [
    {
      id: 1,
      name: "Amber Oval Brooch",
      quantity: 1,
      price: 178,
    },
    {
      id: 2,
      name: "Tan Leather Belt",
      quantity: 1,
      price: 95,
    },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitle
            orderNumber="1001"
            customerName="Noa Azulay"
            date="2025-07-12"
          />

          <div className={styles.actions}>
            <EditBtn className={styles.popupEdit} />
            <Remove className={styles.popupRemove} />
          </div>
        </div>

        <OrderPopupTable products={products} />

        <OrderPopupSumarry total={273} />
      </div>
    </div>
  );
}

export default OrderPopup;
