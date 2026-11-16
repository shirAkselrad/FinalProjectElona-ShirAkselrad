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


  //getting all the order details including order status and items 
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


  const round = (value) => Number(Number(value).toFixed(2));

  // Current active order items 
  const activeItems =
    summary?.items?.filter((item) => item.status === "Active") || [];

  //getting the price of all the active products before all the promotions 
  const originalTotal = round(
    activeItems.reduce(
      (sum, item) => sum + Number(item.original_price) * Number(item.quantity),
      0,
    ),
  );

  //the count of all the active products 
  const productsTotal = round(
    activeItems.reduce((sum, item) => sum + Number(item.total_price), 0),
  );

  //calculating the general promotion price 
  const discount = Number(summary?.general_discount_percentage || 0);

  //price after the general promotion
  const afterPromotions = round(productsTotal * (1 - discount / 100));

  // the amount of points that were sepent in the original order 
  const originalPointsUsed = Number(summary?.points_used || 0);

  //max amount of points that can be paid by in the updated order 
  const maxPoints = round(
    (afterPromotions * Number(summary?.max_redemption_percentage || 0)) / 100,
  );

  //the amount of points which were used in the updated order 
  const pointsUsed = Math.min(originalPointsUsed, maxPoints);

  // shipping price 
  const updatedShipping =
    activeItems.length === 0 ? 0 : Number(summary?.shipping || 0);

  //final price after points and all the promotions 
  const updatedFinalTotal = round(
    afterPromotions - pointsUsed + updatedShipping,
  );

  //updated summary 
  const updatedSummary = summary && {
    ...summary,
    original_total: originalTotal,
    promotions_discount: round(originalTotal - afterPromotions),
    total_after_promotions: afterPromotions,
    points_used: pointsUsed,
    shipping: updatedShipping,
    final_total: updatedFinalTotal,
  };

  // Refund for the amount paid
  const refundPoints = summary
    ? round(Number(summary.final_price) - updatedFinalTotal)
    : 0;

  // Return redeemed points
  const returnedPoints = round(originalPointsUsed - pointsUsed);

  // Earned points
  const originalEarnedPoints = Number(summary?.points_earned || 0);

  const oldEligible = Math.max(
    0,
    Number(summary?.final_price || 0) - Number(summary?.shipping || 0),
  );


  //the points calculation 
  const newEligible = Math.max(0, updatedFinalTotal - updatedShipping);

  const updatedEarnedPoints =
    activeItems.length === 0
      ? 0
      : oldEligible > 0
        ? Math.min(
            originalEarnedPoints,
            Math.round(originalEarnedPoints * (newEligible / oldEligible)),
          )
        : originalEarnedPoints;

  const reversedEarnedPoints = round(
    originalEarnedPoints - updatedEarnedPoints,
  );

  const totalPointsChange = round(
    refundPoints + returnedPoints - reversedEarnedPoints,
  );

  // Order item statuses
  const hasPendingEdit = summary?.items?.some(
    (item) => item.status === "Inactive",
  );

  const hasChangedItems = summary?.items?.some(
    (item) => item.status === "Inactive" || item.status === "Refunded",
  );

  const showRefundSummary = !isCanceledRefund && (isRefunds || hasChangedItems);

  // Full cancellation summary
  const canceledSummary = summary && {
    ...summary,
    total_items: 0,
    original_total: 0,
    promotions_discount: 0,
    total_after_promotions: 0,
    points_used: 0,
    shipping: 0,
    final_total: 0,
  };

  // Full cancellation points
  const canceledRefundPoints = Number(summary?.final_price || 0);
  const canceledReturnedPoints = originalPointsUsed;
  const canceledReversedPoints = originalEarnedPoints;

  const canceledTotalPointsChange = round(
    canceledRefundPoints + canceledReturnedPoints - canceledReversedPoints,
  );

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

                    <BrightGeneralBtn text="REJECT" onClick={onReject} />
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
              // Full cancellation
              <div className={styles.totals}>
                <OrderSummaryTotal
                  order={summary}
                  title="ORIGINAL ORDER"
                  isManagement={true}
                />

                <OrderSummaryTotal
                  order={canceledSummary}
                  title="CANCELED ORDER"
                  isManagement={true}
                />

                <div className={styles.refund}>
                  <div>
                    <span>REFUND POINTS</span>
                    <strong>{canceledRefundPoints.toFixed(2)} points</strong>
                  </div>

                  <div>
                    <span>RETURNED POINTS</span>
                    <strong>+{canceledReturnedPoints.toFixed(2)} points</strong>
                  </div>

                  <div>
                    <span>REVERSED EARNED POINTS</span>
                    <strong>-{canceledReversedPoints.toFixed(2)} points</strong>
                  </div>

                  <div>
                    <span>TOTAL POINTS CHANGE</span>
                    <strong>
                      {canceledTotalPointsChange.toFixed(2)} points
                    </strong>
                  </div>
                </div>
              </div>
            ) : showRefundSummary ? (
              // Product edits
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
                    <div>
                      <span>REFUND POINTS</span>
                      <strong>{refundPoints.toFixed(2)} points</strong>
                    </div>

                    <div>
                      <span>RETURNED POINTS</span>
                      <strong>+{returnedPoints.toFixed(2)} points</strong>
                    </div>

                    <div>
                      <span>REVERSED EARNED POINTS</span>
                      <strong>-{reversedEarnedPoints.toFixed(2)} points</strong>
                    </div>
                    <div>
                      <span>UPDATED EARNED POINTS</span>
                      <strong>{updatedEarnedPoints.toFixed(2)} points</strong>
                    </div>

                    <div>
                      <span>TOTAL POINTS CHANGE</span>
                      <strong>{totalPointsChange.toFixed(2)} points</strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Regular order
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
