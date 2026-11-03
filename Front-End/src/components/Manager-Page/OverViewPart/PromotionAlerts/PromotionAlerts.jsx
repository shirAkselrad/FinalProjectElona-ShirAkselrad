import styles from "./promotionAlerts.module.css";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import GeneralPromotionsTable from "../../StoreManagement-Page/GeneralPromotionsTable/GeneralPromotionsTable.jsx";
import { useEffect, useState } from "react";

function PromotionAlerts() {
  const [popup, setPopup] = useState(null);
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    const getPromotions = async () => {
      try {
        const response = await fetch("/api/manager/getGeneralPromotions", {
          method: "GET",
        });
        const data = await response.json();
        if (data.success) setPromotions(data.promotions);
      } catch (error) {
        console.error("Error getting promotions: ", error);
      }
    };
    getPromotions();
  }, []);

  const handleActivate = async (promotion_id) => {
    try {
      const response = await fetch("/api/manager/activatePromotion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotion_id }),
      });
      if (!response.ok) throw new Error("Couldn't activate promotion");
      setPromotions((prev) =>
        prev.map((promotion) => ({
          ...promotion,
          status:
            promotion.promotion_id === promotion_id ? "Active" : "Not Active",
        })),
      );
      setPopup({
        type: "success",
        message: "Promotion activated successfully!",
      });
    } catch (error) {
      console.error("Error activating promotion: ", error);
      setPopup({
        type: "error",
        message: "Promotion was not activated",
      });
    }
  };

  const now = new Date();
  const hasActivePromotion = promotions.some(
    (promotion) =>
      promotion.status === "Active" &&
      new Date(promotion.start_date) <= now &&
      new Date(promotion.end_date) > now,
  );

  const availablePromotions = hasActivePromotion
    ? []
    : promotions.filter(
        (promotion) =>
          promotion.status === "Not Active" &&
          new Date(promotion.start_date) <= now &&
          new Date(promotion.end_date) > now,
      );
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>PROMOTION ALERTS – READY TO ACTIVATE</h3>
      </div>

      {availablePromotions.length === 0 ? (
        <p className={styles.empty}>
          {hasActivePromotion
            ? "A promotion is currently active."
            : "No promotions waiting for activation."}
        </p>
      ) : (
        <GeneralPromotionsTable
          promotions={availablePromotions}
          onActivate={handleActivate}
          variant="overview"
        />
      )}

      {popup && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
          autoClose={popup.type === "success"}
        />
      )}
    </div>
  );
}
export default PromotionAlerts;
