import styles from "./OrderPopupEdit.module.css";
import { useState, useEffect } from "react";
import OrderPopupTitleView from "../../OrderPopupView-Window/OrderPopupTitleView/OrderPopupTitleView.jsx";
import OrderSummaryTable from "../../../../Shop-Page/OrderSummary/OrderSummaryTable/OrderSummaryTable.jsx";
import OrderSummaryTotal from "../../../../Shop-Page/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";

function OrderPopupEdit({
  order,
  onClose,
  onCancel,
  onSave,
  isManager = false,
}) {
  const [editedProducts, setEditedProducts] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    //getting all the order summary information
    const getOrderSummary = async () => {
      try {
        setSummary(null);
        setEditedProducts([]);

        const url = isManager
          ? `/api/manager/orders/${order.order_id}/summary`
          : `/api/employee/orders/${order.order_id}/summary`;

        const response = await fetch(url);

        if (!response.ok) throw new Error("Couldn't get order summary");

        const data = await response.json();

        setSummary(data.order);

        setEditedProducts(
          data.order.items.map((product) => ({
            ...product,
            original_quantity: Number(product.quantity),
          })),
        );
      } catch (error) {
        console.error("Couldn't get order summary:", error);
      }
    };

    getOrderSummary();
  }, [order.order_id, isManager]);

  //changing specific product quanitity
  const handleQuantityChange = (orderItemId, value) => {
      console.log("Quantity change:", { orderItemId, value });

      console.table(
        editedProducts.map((product) => ({
          order_item_id: product.order_item_id,
          status: product.status,
          quantity: product.quantity,
          original_quantity: product.original_quantity,
        })),
      );

    if (value === "") return;

    const quantity = Number(value);

    setEditedProducts((prev) =>
      //will not change the product quantity if the request product is not in the array/product is not active/quantity is not integer/ quatity is negative/the new quantity is bigger than it was before
      prev.map((product) => {
        if (
          product.order_item_id !== orderItemId ||
          product.status !== "Active" ||
          !Number.isInteger(quantity) ||
          quantity < 0 ||
          quantity > product.original_quantity
        ) {
          return product;
        }

        return { ...product, quantity };
      }),
    );
  };

  //all the active products in the order
  const activeProducts = editedProducts.filter(
    (product) => product.status === "Active",
  );

  //all the edited products in the order
  const editedItems = activeProducts.reduce(
    (count, product) => count + Number(product.quantity),
    0,
  );

  //the original total price (without promotions and points or shipping )
  const originalTotal = activeProducts.reduce(
    (sum, product) =>
      sum + Number(product.original_price) * Number(product.quantity),
    0,
  );

  //final price for payment  after promotions
  const productsTotal = activeProducts.reduce(
    (sum, product) =>
      sum + Number(product.sale_price) * Number(product.quantity),
    0,
  );

  //the general promotion price
  const generalDiscount = Number(
    (
      productsTotal *
      (Number(summary?.general_discount_percentage || 0) / 100)
    ).toFixed(2),
  );

  //final price after general promotion (without shipping and points )
  const totalAfterPromotions = Number(
    (productsTotal - generalDiscount).toFixed(2),
  );

  //the max amount of points which can be paid
  const maxPoints = Number(
    (
      (totalAfterPromotions * Number(summary?.max_redemption_percentage || 0)) /
      100
    ).toFixed(2),
  );
  //the actual amount of points which were used
  const pointsUsed = Math.min(Number(summary?.points_used || 0), maxPoints);

  //shipping price
  const shipping = editedItems === 0 ? 0 : Number(summary?.shipping || 0);

  //updated summary after all the products edits
  const updatedSummary = summary && {
    ...summary,
    total_items: editedItems,
    original_total: originalTotal,
    promotions_discount: Number(
      (originalTotal - totalAfterPromotions).toFixed(2),
    ),
    total_after_promotions: totalAfterPromotions,
    points_used: pointsUsed,
    shipping: shipping,
    final_total: Number(
      (Math.max(0, totalAfterPromotions - pointsUsed) + shipping).toFixed(2),
    ),
  };

  //finding all the products that have been changed
  const changedProducts = activeProducts
    .filter((product) => Number(product.quantity) !== product.original_quantity)
    .map((product) => ({
      order_item_id: product.order_item_id,
      quantity: Number(product.quantity),
    }));

  //contains only the products and the order ids which have been changed
  const editedOrder = {
    order_id: order.order_id,
    products: changedProducts,
  };

  //checking if there were any changed
  const hasChanges = changedProducts.length > 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitleView
            orderId={order.order_id}
            customerName={`${order.first_name} ${order.last_name}`}
            date={new Date(order.created_at).toLocaleDateString("en-GB")}
          />

          <div className={styles.actions}>
            <GeneralBtn
              text="SAVE"
              onClick={() => {
                console.log("SAVE CLICKED");
                console.log("summary:", summary);
                console.log("hasChanges:", hasChanges);
                console.log("changedProducts:", changedProducts);
                console.log("editedOrder:", editedOrder);

                if (summary && hasChanges) {
                  onSave(editedOrder);
                }
              }}
              className={styles.saveBtn}
            />

            <BrightGeneralBtn text="CANCEL" onClick={onCancel} />

            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        {summary && (
          <div className={styles.summary}>
            <OrderSummaryTable
              items={editedProducts}
              isEditable={true}
              onQuantityChange={handleQuantityChange}
            />

            <OrderSummaryTotal
              order={updatedSummary}
              minDeliveryDate={summary.min_delivery_date?.slice(0, 10)}
              maxDeliveryDate={summary.max_delivery_date?.slice(0, 10)}
              isManagement={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderPopupEdit;
