import styles from "./orderPopupView.module.css";
import OrderPopupTitleView from "../OrderPopupTitleView/OrderPopupTitleView.jsx";
import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import OrderSummaryTable from "../../../../Shop-Page/OrderSummary/OrderSummaryTable/OrderSummaryTable.jsx";
import OrderSummaryTotal from "../../../../Shop-Page/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.jsx";
import { useEffect, useState } from "react";

function OrderPopupView({
  order,
  onClose,
  onEdit,
  onApprove,
  onReject,
  isManager = false,
  isRefunds = false,
}) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const getOrderSummary = async () => {
      try {
        setSummary(null);

        const url = isManager
          ? `/api/manager/orders/${order.order_id}/summary`
          : `/api/employee/orders/${order.order_id}/summary`;

        const response = await fetch(url);
     

        if (!response.ok) throw new Error("Couldn't get order summary");

        const data = await response.json();
        console.log("POINTS DEBUG:", {
          pointsUsed: data.order.points_used,
          maxPercentage: data.order.max_redemption_percentage,
        });
           console.log(
             "ORDER ITEMS:",
             JSON.stringify(data.order.items, null, 2),
           );
        setSummary(data.order);
      } catch (error) {
        console.error("Couldn't get order summary:", error);
      }
    };

    getOrderSummary();
  }, [order.order_id, isManager]);

  const round = (value) => Number(value.toFixed(2));

  const activeItems =
    summary?.items?.filter((item) => item.status === "Active") || [];
  console.log("ALL ITEMS:", summary?.items);
  console.log("ACTIVE ITEMS:", activeItems);

  const originalTotal = round(
    activeItems.reduce(
      (sum, item) => sum + Number(item.original_price) * Number(item.quantity),
      0,
    ),
  );

  const productsTotal = round(
    activeItems.reduce((sum, item) => sum + Number(item.total_price), 0),
  );

  const discount = Number(summary?.general_discount_percentage || 0);
  const afterPromotions = round(productsTotal * (1 - discount / 100));

  const maxPoints = round(
    (afterPromotions * Number(summary?.max_redemption_percentage || 0)) / 100,
  );

  const pointsUsed = Math.min(Number(summary?.points_used || 0), maxPoints);

  const updatedSummary = summary && {
    ...summary,
    original_total: originalTotal,
    promotions_discount: round(originalTotal - afterPromotions),
    total_after_promotions: afterPromotions,
    points_used: pointsUsed,
    final_total: round(afterPromotions - pointsUsed + Number(summary.shipping)),
  };

  const refundPoints = summary
    ? round(Number(summary.total_after_promotions) - afterPromotions)
    : 0;

  const hasPendingEdit = summary?.items?.some(
    (item) => item.status === "Inactive",
  );

  const hasChangedItems = summary?.items?.some(
    (item) => item.status === "Inactive" || item.status === "Refunded",
  );

  const showRefundSummary = isRefunds || hasChangedItems;

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
            {isRefunds ? (
              <div className={styles.refundActions}>
                <GeneralBtn text="APPROVE" onClick={onApprove} />
                <BrightGeneralBtn text="REJECT" onClick={onReject} />
              </div>
            ) : (
              order.status === "PAID" &&
              !hasPendingEdit && (
                <EditBtn onClick={onEdit} className={styles.popupEdit} />
              )
            )}

            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>
        {summary && (
          <div className={styles.summary}>
            <OrderSummaryTable items={summary.items} />

            {showRefundSummary ? (
              <div className={styles.totals}>
                <OrderSummaryTotal
                  order={summary}
                  title="ORIGINAL ORDER"
                  isManagement={true}
                />

                <OrderSummaryTotal
                  order={updatedSummary}
                  title="UPDATED ORDER"
                  isManagement={true}
                />

                {hasPendingEdit && (
                  <div className={styles.refund}>
                    <span>REFUND POINTS</span>
                    <strong>{refundPoints.toFixed(2)} points</strong>
                  </div>
                )}
              </div>
            ) : (
              <OrderSummaryTotal
                order={summary}
                minDeliveryDate={summary.min_delivery_date?.slice(0, 10)}
                maxDeliveryDate={summary.max_delivery_date?.slice(0, 10)}
                isManagement={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderPopupView;
