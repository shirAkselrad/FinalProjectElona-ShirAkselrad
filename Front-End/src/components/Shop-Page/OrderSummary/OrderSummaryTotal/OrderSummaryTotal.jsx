import styles from "./orderSummaryTotal.module.css";
function OrderSummaryTotal({ order}) {
 return (
   <div className={styles.orderSummaryTotal}>
     <h2>ORDER TOTAL</h2>

     <div className={styles.totalRow}>
       <span>Original Total</span>
       <span>{Number(order.original_total)}₪</span>
     </div>

     <div className={styles.totalRow}>
       <span>Promotions Discount</span>
       <span>-{Number(order.promotions_discount)}₪</span>
     </div>

     <div className={styles.totalRow}>
       <span>Total After Promotions</span>
       <span>{Number(order.total_after_promotions)}₪</span>
     </div>

     <div className={styles.totalRow}>
       <span>Loyalty Points ({order.points_used} points)</span>
       <span>-{Number(order.points_used)}₪</span>
     </div>

     <div className={styles.totalRow}>
       <span>Shipping</span>
       <span>{Number(order.shipping)}₪</span>
     </div>

     <div className={styles.finalTotal}>
       <span>FINAL TOTAL</span>
       <span>{Number(order.final_total)}₪</span>
     </div>
   </div>
 );
}
export default OrderSummaryTotal;
