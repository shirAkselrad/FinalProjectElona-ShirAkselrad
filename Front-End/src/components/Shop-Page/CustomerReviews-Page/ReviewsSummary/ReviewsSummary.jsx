import styles from "./reviewsSummary.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function ReviewsSummary({ avgRating, totalReviews }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Overall Rating</h2>

      <div className={styles.rating}>
        {totalReviews > 0 ? avgRating.toFixed(1) : "—"}
        <span> / 5</span>
      </div>

      <div className={styles.stars}>
        {stars.map((star) => {
          if (avgRating >= star) return <FaStar key={star} />;

          if (avgRating >= star - 0.5) return <FaStarHalfAlt key={star} />;

          return <FaRegStar key={star} />;
        })}
      </div>

      <p className={styles.totalReviews}>
        Based on {totalReviews} customer reviews
      </p>
    </div>
  );
}

export default ReviewsSummary;
