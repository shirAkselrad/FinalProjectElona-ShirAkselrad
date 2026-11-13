import { useEffect, useState } from "react";
import styles from "./orderPopupView.module.css";

import OrderPopupTitleView from "../OrderPopupTitleView/OrderPopupTitleView.jsx";
import EditBtn from "../../../../General/EditBtn/EditBtn.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import OrderSummaryTable from "../../../../Shop-Page/OrderSummary/OrderSummaryTable/OrderSummaryTable.jsx";
import OrderSummaryTotal from "../../../../Shop-Page/OrderSummary/OrderSummaryTotal/OrderSummaryTotal.jsx";

function OrderPopupView({
  order,
  onClose,
  onEdit,
  onApprove,
  onReject,
  isManager = false,
  isRefunds = false,
  refundType = "edit",
}) {
  const [summary, setSummary] = useState(null);

  const isCanceledRefund = isRefunds && refundType === "canceled";

  useEffect(() => {
    const getOrderSummary = async () => {
      try {
        setSummary(null);

        const url = isManager
          ? `/api/manager/orders/${order.order_id}/summary`
          : `/api/employee/orders/${order.order_id}/summary`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Couldn't get order summary");
        }

        const data = await response.json();
        setSummary(data.order);
      } catch (error) {
        console.error("Couldn't get order summary:", error);
      }
    };

    getOrderSummary();
  }, [order.order_id, isManager]);

  const round = (value) => Number(value.toFixed(2));

  // Current active products
  const activeItems =
    summary?.items?.filter((item) => item.status === "Active") || [];

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

  // Updated summary for product edits
  const updatedSummary = summary && {
    ...summary,
    original_total: originalTotal,
    promotions_discount: round(originalTotal - afterPromotions),
    total_after_promotions: afterPromotions,
    points_used: pointsUsed,
    final_total: round(afterPromotions - pointsUsed + Number(summary.shipping)),
  };

  // Refund amount
  const refundPoints = summary
    ? isCanceledRefund
      ? Number(summary.final_price)
      : round(Number(summary.total_after_promotions) - afterPromotions)
    : 0;

  const hasPendingEdit = summary?.items?.some(
    (item) => item.status === "Inactive",
  );

  const hasChangedItems = summary?.items?.some(
    (item) => item.status === "Inactive" || item.status === "Refunded",
  );

  const showRefundSummary = !isCanceledRefund && (isRefunds || hasChangedItems);

  return (
    <div className={styles.overlay}>
      <div className={styles.orderPopup}>
        <div className={styles.top}>
          <OrderPopupTitleView
            orderId={order.order_id}
            customerName={
              [order.first_name, order.last_name].filter(Boolean).join(" ") ||
              order.client_email
            }
            date={new Date(order.created_at).toLocaleDateString("en-GB")}
          />

          <div className={styles.actions}>
            {isRefunds
              ? summary && (
                  <div className={styles.refundActions}>
                    <GeneralBtn
                      text={isCanceledRefund ? "APPROVE REFUND" : "APPROVE"}
                      onClick={onApprove}
                    />

                    {!isCanceledRefund && (
                      <BrightGeneralBtn text="REJECT" onClick={onReject} />
                    )}
                  </div>
                )
              : order.status === "PAID" &&
                !hasPendingEdit && (
                  <EditBtn onClick={onEdit} className={styles.popupEdit} />
                )}

            <Remove onClick={onClose} className={styles.popupRemove} />
          </div>
        </div>

        {summary && (
          <div className={styles.summary}>
            <OrderSummaryTable items={summary.items} />

            {isCanceledRefund ? (
              <div className={styles.totals}>
                <OrderSummaryTotal
                  order={summary}
                  title="CANCELED ORDER"
                  isManagement={true}
                />

                <div className={styles.refund}>
                  <span>REFUND POINTS</span>
                  <strong>{refundPoints.toFixed(2)} points</strong>
                </div>
              </div>
            ) : showRefundSummary ? (
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
