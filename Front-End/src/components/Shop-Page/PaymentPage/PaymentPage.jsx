import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useState } from "react";
import styles from "./paymentPage.module.css";

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "ILS",
  intent: "capture",
};

function PaymentPage() {
  const navigate = useNavigate();
  const { getCartAmount } = useCart();

  const [paymentError, setPaymentError] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.paymentCard}>
        <div className={styles.heading}>
          <span className={styles.subtitle}>ELONA · SECURE CHECKOUT</span>
          <h1>Complete Your Order</h1>
          <p>Choose your preferred payment method</p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.paymentButtons}>
          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              style={{
                layout: "vertical",
                shape: "rect",
                label: "paypal",
                height: 48,
              }}
              onInit={() => {
                console.log("PayPal Buttons initialized");
              }}
              createOrder={async () => {
                try {
                  const response = await fetch("/api/payment/createOrder", {
                    method: "POST",
                    credentials: "include",
                  });

                  const data = await response.json();

                  if (!response.ok || !data.success) {
                    throw new Error(
                      data.message || "Couldn't create PayPal order",
                    );
                  }

                  console.log("PayPal order created:", data.paypal_order_id);

                  return data.paypal_order_id;
                } catch (error) {
                  console.error("PayPal create order error:", error);
                  setPaymentError("Unable to start payment. Please try again.");
                  throw error;
                }
              }}
              onApprove={async (data) => {
                console.log("PayPal approved order:", data.orderID);

                // The buyer approved the payment, but capture is not confirmed yet
                setPaymentError("");

                try {
                  const response = await fetch("/api/payment/captureOrder", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      paypal_order_id: data.orderID,
                    }),
                  });

                  const result = await response.json();

                  console.log("Capture response:", result);

                  if (!response.ok || !result.success) {
                    throw new Error(
                      result.message || "Payment confirmation failed",
                    );
                  }

                  console.log("Payment completed successfully:", result);

                  // Navigate immediately after the server confirms payment
                  navigate("/paymentSuccess", {
                    replace: true,
                    state: {
                      order_id: result.order_id,
                    },
                  });

                  // Refresh the cart without delaying navigation
                  Promise.resolve()
                    .then(() => getCartAmount())
                    .catch((error) => {
                      console.error("Couldn't update cart amount:", error);
                    });
                } catch (error) {
                  console.error("Payment confirmation error:", error);

                  // A failed response does not necessarily mean
                  // the PayPal charge failed
                  setPaymentError(
                    "We couldn't confirm your payment status. " +
                      "Please don't try paying again yet.",
                  );
                }
              }}
              onError={(error) => {
                console.error("PayPal payment error:", error);

                setPaymentError(
                  (currentError) =>
                    currentError ||
                    "A PayPal error occurred. Please check your payment status before trying again.",
                );
              }}
              onCancel={(data) => {
                console.log("PayPal payment cancelled:", data);
              }}
            />
          </PayPalScriptProvider>

      

          {paymentError && (
            <p role="alert" style={{ color: "#a94442", marginTop: "16px" }}>
              {paymentError}
            </p>
          )}
        </div>

        <div className={styles.secureMessage}>
          <span>♢</span>
          <p>Secure payment powered by PayPal</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
