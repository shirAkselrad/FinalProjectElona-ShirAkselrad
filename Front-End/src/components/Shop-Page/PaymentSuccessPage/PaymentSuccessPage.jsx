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
            <h2>YOUR LOYALTY POINTS</h2>

            <div className={styles.pointsGrid}>
              <div className={styles.pointsItem}>
                <strong>+{points.earned}</strong>
                <span>POINTS EARNED</span>
              </div>

              <div className={styles.pointsItem}>
                <strong>{points.total}</strong>
                <span>TOTAL POINTS BALANCE</span>
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
