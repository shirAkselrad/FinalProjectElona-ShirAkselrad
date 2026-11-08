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

  const handleQuantityChange = (orderItemId, value) => {
    if (value === "") return;

    const quantity = Number(value);

    setEditedProducts((prev) =>
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

  const activeProducts = editedProducts.filter(
    (product) => product.status === "Active",
  );

  const editedItems = activeProducts.reduce(
    (count, product) => count + Number(product.quantity),
    0,
  );

  const originalTotal = activeProducts.reduce(
    (sum, product) =>
      sum + Number(product.original_price) * Number(product.quantity),
    0,
  );

  const productsTotal = activeProducts.reduce(
    (sum, product) =>
      sum + Number(product.sale_price) * Number(product.quantity),
    0,
  );

  const generalDiscount = Number(
    (
      productsTotal *
      (Number(summary?.general_discount_percentage || 0) / 100)
    ).toFixed(2),
  );

  const totalAfterPromotions = Number(
    (productsTotal - generalDiscount).toFixed(2),
  );

 
const maxPoints = Number(
  (
    (totalAfterPromotions * Number(summary?.max_redemption_percentage || 0)) /
    100
  ).toFixed(2),
);

const pointsUsed = Math.min(Number(summary?.points_used || 0), maxPoints);

  const shipping = Number(summary?.shipping || 0);

  const updatedSummary = summary && {
    ...summary,
    original_total: originalTotal,
    promotions_discount: Number(
      (originalTotal - totalAfterPromotions).toFixed(2),
    ),
    total_after_promotions: totalAfterPromotions,
    points_used:pointsUsed,
    final_total: Number(
      (Math.max(0, totalAfterPromotions - pointsUsed) + shipping).toFixed(2),
    ),
  };

  const changedProducts = activeProducts
    .filter((product) => Number(product.quantity) !== product.original_quantity)
    .map((product) => ({
      order_item_id: product.order_item_id,
      quantity: Number(product.quantity),
    }));

  const editedOrder = {
    order_id: order.order_id,
    products: changedProducts,
  };

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
                if (summary && hasChanges) onSave(editedOrder);
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
