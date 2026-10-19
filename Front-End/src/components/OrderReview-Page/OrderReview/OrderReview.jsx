import styles from "./orderReview.module.css";
import { useState, useEffect } from "react";
import Stars from "../Stars/Stars.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import TextAreaField from "../../General/TextAreaField/TextAreaField.jsx";
import Title from "../../General/Title/Title.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";

function OrderReview() {
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [alreadyReviewed, setAlreadyReviewed] = useState(null);
  //getting all the params from the url
  const params = new URLSearchParams(window.location.search);
  //getting the value of order_id from the url's params
  const order_id = Number(params.get("order_id"));

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const isFormValid = rating > 0;

  useEffect(() => {
    async function checkReview() {
      try {
        const response = await fetch(`/api/orderReview/${order_id}`, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setAlreadyReviewed(data.alreadyReviewed);
          if (data.alreadyReviewed)
            setDisplayMessagePopup({
              show: true,
              message:
                "You already reviewed this order. Thank you for your feedback!",
              type: "success",
            });
        }
      } catch (error) {
        console.error("Error checking review: ", error);
      }
    }
    if (Number.isInteger(order_id) && order_id > 0) checkReview();
  }, [order_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !isFormValid ||
      !Number.isInteger(order_id) ||
      order_id <= 0 ||
      alreadyReviewed !== false
    )
      return;
    try {
      const response = await fetch("/api/orderReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id,
          rating,
          comment,
        }),
      });
      if (response.ok) setAlreadyReviewed(true);
      const data = await response.json();
      setDisplayMessagePopup({
        show: true,
        message: data.message,
        type: response.ok ? "success" : "error",
      });
    } catch (error) {
      setDisplayMessagePopup({
        show: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }
  return (
    <div className={styles.container}>
      <Title text="RATE YOUR EXPERIENCE" />
      <p className={styles.description}>
        Thank you for shopping with ELONA!
        <br />
        We would love to hear about your shopping experience.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.ratingSection}>
          <p className={styles.label}>HOW WAS YOUR EXPERIENCE?</p>
          <Stars rating={rating} setRating={setRating} />
        </div>

        <div className={styles.commentSection}>
          <TextAreaField
            label="TELL US MORE (OPTIONAL)"
            placeholder="Share your thoughts with us..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
        </div>

        <div className={styles.buttonContainer}>
          <GeneralBtn
            text="SUBMIT REVIEW"
            type="submit"
            disabled={!isFormValid || alreadyReviewed !== false}
          />
        </div>
      </form>
      {displayMessagePopup.show && (
        <MessagePopup
          buttonText={
            displayMessagePopup.type === "success" ? "GO TO WEBSITE" : "OK"
          }
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() => {
            if (displayMessagePopup.type === "success")
              window.location.href = "/";
            else
              setDisplayMessagePopup({
                show: false,
                message: "",
                type: "",
              });
          }}
        />
      )}
    </div>
  );
}
export default OrderReview;
