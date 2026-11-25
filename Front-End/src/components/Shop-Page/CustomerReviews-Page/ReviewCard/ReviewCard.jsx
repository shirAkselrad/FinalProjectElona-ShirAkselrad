import styles from "./reviewCard.module.css";
import { FaStar, FaRegStar } from "react-icons/fa";

function ReviewCard({ review }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={styles.reviewCard}>
      <div className={styles.top}>
        <div className={styles.stars}>
          {stars.map((star) =>
            star <= Number(review.rating) ? (
              <FaStar key={star} />
            ) : (
              <FaRegStar key={star} />
            ),
          )}
        </div>

        <span className={styles.date}>
          {new Date(review.created_at).toLocaleDateString("en-GB")}
        </span>
      </div>

      <p className={styles.comment}>{review.comment}</p>

      <div className={styles.footer}>
        <span className={styles.customer}>ELONA Customer</span>
      </div>
    </div>
  );
}

export default ReviewCard;
