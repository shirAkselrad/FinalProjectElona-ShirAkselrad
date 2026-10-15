import styles from "./paymentSuccessPage.module.css";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.order_id;

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
