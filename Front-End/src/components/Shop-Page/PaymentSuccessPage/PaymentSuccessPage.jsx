import styles from "./paymentSuccessPage.module.css";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  //getting the order id by react router
  const orderId = location.state?.order_id;
  //user points (earned and total)
  const [points, setPoints] = useState(null);

  //getting both earned points after a successfull order payment and total points the user has
  useEffect(() => {
    if (!orderId) return;

    async function getOrderPoints() {
      try {
        const response = await fetch(`/api/client/orders/${orderId}/points`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Couldn't get order points");
        }

        const data = await response.json();

        if (data.success) {
          setPoints({
            before: Number(data.points_before),
            used: Number(data.points_used),
            earned: Number(data.points_earned),
            total: Number(data.total_points),
          });
        }
      } catch (error) {
        console.error("Couldn't get order points:", error);
      }
    }

    getOrderPoints();
  }, [orderId]);

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <span className={styles.check}>✓</span>
        </div>

        <h1>Payment Successful!</h1>

        <p>Thank you for shopping with ELONA.</p>

        {orderId && (
          <p>
            Your order <strong>#{orderId}</strong> has been confirmed.
          </p>
        )}

        {points && (
          <div className={styles.pointsSection}>
            <div className={styles.pointsHeading}>
              <span>ELONA</span>
              <h2>Your Loyalty Points</h2>
              <p>YOUR REWARDS SUMMARY</p>
            </div>

            <div className={styles.pointsDetails}>
              <div className={styles.pointsRow}>
                <span>Points before purchase</span>
                <strong>{points.before.toFixed(2)}</strong>
              </div>

              <div className={styles.pointsRow}>
                <span>Points redeemed</span>
                <strong>−{points.used.toFixed(2)}</strong>
              </div>

              <div className={styles.pointsRow}>
                <span>Points earned</span>
                <strong>+{points.earned.toFixed(2)}</strong>
              </div>
            </div>

            <div className={styles.pointsTotal}>
              <div className={styles.totalLabel}>
                <span>CURRENT BALANCE</span>
                <small>Available for your next purchase</small>
              </div>

              <div className={styles.totalValue}>
                <strong>{points.total.toFixed(2)}</strong>
                <small>POINTS</small>
              </div>
            </div>
          </div>
        )}

        <GeneralBtn
          text="Back to Shop"
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}
export default PaymentSuccessPage;
