import styles from "./OrderPopupEdit.module.css";
import { useState } from "react";

import OrderPopupTitleView from "../../OrderPopupView-Window/OrderPopupTitleView/OrderPopupTitleView.jsx";
import OrderPopupSumarryView from "../../OrderPopupView-Window/OrderPopupSumarryView/OrderPopupSumarryView.jsx";
import OrderPopupTableEdit from "../OrderPopupTableEdit/OrderPopupTableEdit.jsx";

import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";

function OrderPopupEdit({ order, onClose, onCancel, onSave }) {
  const [editedProducts, setEditedProducts] = useState(order.products);

  const editedTotal = editedProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0,
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitleView
            orderNumber={order.id}
            customerName={order.client}
            date={order.date}
          />

          <div className={styles.actions}>
            <GeneralBtn
              text="SAVE"
              onClick={onSave}
              className={styles.saveBtn}
            />

            <BrightGeneralBtn text="CANCEL" onClick={onCancel} />

            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        <OrderPopupTableEdit
          products={editedProducts}
          setProducts={setEditedProducts}
        />

        <OrderPopupSumarryView total={editedTotal} />
      </div>
    </div>
  );
}

export default OrderPopupEdit;
