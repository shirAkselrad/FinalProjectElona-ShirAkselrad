import styles from "./reviewCard.module.css";
import Stars from "../../../OrderReview-Page/Stars/Stars";

function ReviewCard({ review }) {
  const customerName =
    [review.first_name, review.last_name].filter(Boolean).join(" ") ||
    review.client_email ||
    "Unknown Customer";
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{customerName}</h3>
        <span>{new Date(review.created_at).toLocaleDateString("en-GB")}</span>
      </div>

      <div className={styles.rating}>
        <Stars rating={Number(review.rating)} readOnly={true} />
      </div>

      <p className={styles.comment}>{review.comment}</p>

      <div className={styles.footer}>
        <span>Order #{review.order_id}</span>
        <span>{review.rating}/5</span>
      </div>
    </div>
  );
}
export default ReviewCard;
