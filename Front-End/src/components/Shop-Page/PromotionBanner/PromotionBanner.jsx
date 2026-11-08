import { useEffect, useState } from "react";
import styles from "./promotionBanner.module.css";
function PromotionBanner() {
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    const getActivePromotion = async () => {
      try {
        const response = await fetch("/api/shop/getActivePromotion", {
          method: "GET",
        });
        if (!response.ok) throw new Error("Couldn;'t get active promotion");
        const data = await response.json();
        if (data.success) setPromotion(data.promotion);
      } catch (error) {
        console.error("Error getting active promotion: ", error);
      }
    };
    getActivePromotion();
  }, []);

  if (!promotion) return null;
  return (
    <div className={styles.banner}>
      <div className={styles.promotionBox}>
        <span className={styles.promotionName}>{promotion.name}</span>

        <span className={styles.separator}>✦</span>

        <span className={styles.discount}>
          ENJOY {promotion.discount_percentage}% OFF
        </span>

        {Number(promotion.min_order_price) > 0 && (
          <span className={styles.condition}>
            ON ORDERS OVER  {Number(promotion.min_order_price)}₪
          </span>
        )}
      </div>
    </div>
  );
}
export default PromotionBanner; 