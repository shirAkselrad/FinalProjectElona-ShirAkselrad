import styles from "./OrderPopupEdit.module.css";
import { useState, useEffect } from "react";
import OrderPopupTitleView from "../../OrderPopupView-Window/OrderPopupTitleView/OrderPopupTitleView.jsx";
import OrderPopupSumarryView from "../../OrderPopupView-Window/OrderPopupSumarryView/OrderPopupSumarryView.jsx";
import OrderPopupTableEdit from "../OrderPopupTableEdit/OrderPopupTableEdit.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";

/**
 *
 * @param {order} order the current order which is getting edited
 * @param {onClose} onClose the event which accurs when the user click on the x btn
 * @param {onCancel} onCancel the event which accurs when the user click on the cancel btn
 * @param {onSave} onSave the  event which accurs when the user click on the saveChanges btn
 * @returns OrderPopupEdit
 */
function OrderPopupEdit({
  order,
  onClose,
  onCancel,
  onSave,
  isManager = false,
}) {
  const [editedProducts, setEditedProducts] = useState([]);
  useEffect(() => {
    //this function responsible to get all the order products details
    async function getOrderProducts() {
      try {
        const url = isManager
          ? `/api/manager/orders/${order.order_id}/items`
          : `/api/employee/orders/${order.order_id}/items`;
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Couldn't get order's products");
        const data = await response.json();
        setEditedProducts(
          data.products.map((product) => ({
            ...product,
            removed: false,
          })),
        );
      } catch (error) {
        console.error("Couldn't get order products: ", error);
      }
    }
    getOrderProducts();
  }, [order.order_id, isManager]);

  //an array which include all the products which didn't removed
  const productsToSave = editedProducts.filter(
    (product) => product.removed === false,
  );

  //calculate the final price after all the edits
  const editedTotal = productsToSave.reduce(
    (sum, product) =>
      sum + Number(product.product_price) * Number(product.quantity),
    0,
  );

  //calculate the final quantity after all the edits
  const editedItems = productsToSave.reduce(
    (count, product) => count + Number(product.quantity),
    0,
  );

  //this object keep the editedOrder so when the save btn is clicked all the details on the current order will be saved
  const editedOrder = {
    ...order,
    products: productsToSave,
    final_price: editedTotal,
    total_items: editedItems,
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitleView
            orderNumber={order.order_id}
            customerName={`${order.first_name} ${order.last_name}`}
            date={new Date(order.created_at).toLocaleDateString("en-GB")}
          />

          <div className={styles.actions}>
            {/*the save btn, which gets 2 events the onSave event which happens when clicked and the updated products are passed the onSave function in Orders.jsx  */}
            <GeneralBtn
              text="SAVE"
              onClick={() => {
                onSave(editedOrder);
                onClose();
              }}
              className={styles.saveBtn}
            />

            <BrightGeneralBtn text="CANCEL" onClick={onCancel} />

            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        {/*gets the editedProducts and gets the setEditedProducts function */}
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
