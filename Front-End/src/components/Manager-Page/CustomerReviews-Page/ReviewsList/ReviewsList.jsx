import styles from "./reviewsList.module.css";
import ReviewCard from "../ReviewCard/ReviewCard";
function ReviewsList({ reviews }) {
  return (
    <div className={styles.reviewsList}>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review.review_id} review={review} />
        ))
      ) : (
        <p>No customer reviews yet.</p>
      )}
    </div>
  );
}
export default ReviewsList;
