import styles from "./promotionAlerts.module.css";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import GeneralPromotionsTable from "../../StoreManagement-Page/GeneralPromotionsTable/GeneralPromotionsTable.jsx";
import { useEffect, useState } from "react";

function PromotionAlerts() {
  const [popup, setPopup] = useState(null);
  const [promotions, setPromotions] = useState([]);

  //gettings the promotion details from back end (deactiving promotions which shouldn't be active)
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

  //activating a promotion (deactiving an old active promotion if exits before starting a new one)
  const handleActivate = async (promotion_id) => {
    try {
      const response = await fetch("/api/manager/activatePromotion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotion_id }),
      });
      if (!response.ok) throw new Error("Couldn't activate promotion");
      //saving the updated promotions 
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
  //checking if there is any active promotion
  const hasActivePromotion = promotions.some(
    (promotion) =>
      promotion.status === "Active" &&
      new Date(promotion.start_date) <= now &&
      new Date(promotion.end_date) > now,
  );

  //finding promotions which can be activate
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
