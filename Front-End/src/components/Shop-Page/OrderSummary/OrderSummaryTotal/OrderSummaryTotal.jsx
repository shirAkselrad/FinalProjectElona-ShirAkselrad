import styles from "./orderSummaryTotal.module.css";

function OrderSummaryTotal({
  order,
  minDeliveryDate,
  maxDeliveryDate,
  isManagement = false,
  title = "ORDER TOTAL",
  vatPercentage,
}) {
  const finalTotal = Number(order.final_total || 0);

  const vatValue = vatPercentage ?? order.vat_percentage;

  const vatRate = Number(vatValue);

  const hasVat =
    vatValue !== null &&
    vatValue !== undefined &&
    vatValue !== "" &&
    Number.isFinite(vatRate) &&
    vatRate >= 0 &&
    vatRate <= 100;

  const totalBeforeVat = hasVat
    ? Number((finalTotal / (1 + vatRate / 100)).toFixed(2))
    : 0;

  const vatAmount = hasVat
    ? Number((finalTotal - totalBeforeVat).toFixed(2))
    : 0;
  return (
    <div
      className={`${styles.orderSummaryTotal} ${
        isManagement ? styles.management : ""
      }`}
    >
      <h2>{title}</h2>

      <div className={styles.totalRow}>
        <span>Original Total</span>
        <span>{Number(order.original_total).toFixed(2)}₪</span>
      </div>

      <div className={styles.totalRow}>
        <span>Total Discounts</span>
        <span>-{Number(order.promotions_discount).toFixed(2)}₪</span>
      </div>

      <div className={styles.totalRow}>
        <span>Total After Promotions</span>
        <span>{Number(order.total_after_promotions).toFixed(2)}₪</span>
      </div>

      <div className={styles.totalRow}>
        <span>Loyalty Points ({order.points_used} points)</span>
        <span>-{Number(order.points_used).toFixed(2)}₪</span>
      </div>

      <div className={styles.totalRow}>
        <span>Shipping</span>
        <span>{Number(order.shipping).toFixed(2)}₪</span>
      </div>

      {hasVat && (
        <>
          <div className={styles.totalRow}>
            <span>Total Before VAT</span>
            <span>{totalBeforeVat.toFixed(2)}₪</span>
          </div>

          <div className={styles.totalRow}>
            <span>VAT ({vatRate}%)</span>
            <span>{vatAmount.toFixed(2)}₪</span>
          </div>
        </>
      )}

      <div className={styles.finalTotal}>
        <span>FINAL TOTAL (INCLUDING VAT)</span>
        <span>{finalTotal.toFixed(2)}₪</span>
      </div>

      {minDeliveryDate && maxDeliveryDate && (
        <div className={styles.deliveryRow}>
          <span>Estimated Delivery</span>
          <span>
            {minDeliveryDate} – {maxDeliveryDate}
          </span>
        </div>
      )}
    </div>
  );
}

export default OrderSummaryTotal;
