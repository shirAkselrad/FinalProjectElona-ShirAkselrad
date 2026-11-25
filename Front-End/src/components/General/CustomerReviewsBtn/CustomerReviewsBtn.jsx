import styles from "./customerReviewsBtn.module.css";
import { useNavigate } from "react-router-dom";

function CustomerReviewsBtn() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.customerReviewsBtn}
      onClick={() => navigate("/customerReviewsPage")}
    >
      Customer Reviews
    </button>
  );
}

export default CustomerReviewsBtn;
