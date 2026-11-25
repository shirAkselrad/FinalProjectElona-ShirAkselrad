import { useState, useEffect } from "react";
import styles from "./customerReviewsPage.module.css";
import ReviewsSummary from "../ReviewsSummary/ReviewsSummary.jsx";
import ReviewCard from "../ReviewCard/ReviewCard.jsx";

function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //getting all customer reviews
  async function getCustomerReviews() {
    try {
      const response = await fetch("/api/shop/customerReviews", {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      } else setError("Couldn't get customer reviews.");
    } catch (error) {
      console.error("Error getting customer reviews:", error);
      setError("Couldn't get customer reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCustomerReviews();
  }, []);

return (
  <div className={styles.customerReviews}>
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <h1>Customer Reviews</h1>
        <p>Discover what our customers say about ELONA.</p>
      </div>

      {loading ? (
        <p className={styles.message}>Loading reviews...</p>
      ) : error ? (
        <p className={styles.message}>{error}</p>
      ) : (
        <div className={styles.content}>
          <ReviewsSummary avgRating={avgRating} totalReviews={totalReviews} />

          {reviews.length > 0 ? (
            <div className={styles.reviewsGrid}>
              {reviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </div>
          ) : (
            <p className={styles.message}>No customer reviews yet.</p>
          )}
        </div>
      )}
    </div>
  </div>
);
}

export default CustomerReviewsPage;
