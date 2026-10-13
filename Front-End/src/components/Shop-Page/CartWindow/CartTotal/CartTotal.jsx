import styles from "./cartTotal.module.css";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function CartTotal({ total, disabled, onClose }) {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  async function handleCheckout() {
    try {
      const response = await fetch("/api/cart/startCheckout", {
        method: "PUT",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setPopup({
          show: true,
          message: data.message || "Couldn't proceed to checkout",
          type: "error",
        });
        return;
      }
      onClose();
      navigate("/orderSummary");
    } catch (error) {
      console.error("Error starting checkout: ", error);
      setPopup({
        show: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }
  return (
    <div className={styles.cartTotal}>
      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}
      <div className={styles.totalRow}>
        <span className={styles.totalText}>TOTAL</span>
        <span className={styles.price}>{total}₪</span>
      </div>

      <GeneralBtn
        text="CHECKOUT"
        disabled={disabled}
        onClick={handleCheckout}
      />
    </div>
  );
}

export default CartTotal;
