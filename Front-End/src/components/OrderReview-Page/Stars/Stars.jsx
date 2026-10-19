import styles from "./stars.module.css";
import Star from "../Star/Star.jsx";

function Stars({ rating, setRating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          value={star}
          filled={star <= rating}
          onClick={setRating}
        />
      ))}
    </div>
  );
}

export default Stars;
