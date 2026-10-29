import styles from "./customerReviews.module.css";
import { useState, useEffect } from "react";
import SectionTitle from "../../../Employee-Page/SectionTitle/SectionTitle.jsx";
import ReviewsList from "../ReviewsList/ReviewsList.jsx";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  //getting all the reviews
  useEffect(() => {
    async function getReviews() {
      try {
        const response = await fetch("/api/manager/reviews", {
          method: "GET",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Reviews response:", data);
        if (data.success) setReviews(data.reviews);
        else setError(true);
      } catch (error) {
        console.error("Error getting customer reviews: ", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getReviews();
  }, []);

  //calculating all the reviews statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        totalReviews
      ).toFixed(1)
    : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5,
  ).length;
  return (
    <div className={styles.customerReviews}>
      <SectionTitle title="Customer Reviews" />

      <div className={styles.summary}>
        <div>
          <span>Total Reviews</span>
          <h2>{totalReviews}</h2>
        </div>

        <div>
          <span>Average Rating</span>
          <h2>{avgRating} ★</h2>
        </div>

        <div>
          <span>5-Star Reviews</span>
          <h2>{fiveStarReviews}</h2>
        </div>
      </div>

      {isLoading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>Couldn't load customer reviews.</p>
      ) : (
        <ReviewsList reviews={reviews} />
      )}
    </div>
  );
}
export default CustomerReviews;