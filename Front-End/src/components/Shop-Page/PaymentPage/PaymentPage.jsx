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
  const { getCartAmount } = useCart(); //(cart items- including the front imgs, total items count and total price of all the items in the cart)

  const [paymentError, setPaymentError] = useState("");

  //after successfull payment, updating: inventory, user points and order status
  const recoveryPayment = async (paypalOrderId) => {
    const response = await fetch("/api/payment/recoverOrder", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paypal_order_id: paypalOrderId,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success)
      throw new Error(result.message || "Payment recovery failed");
    return result;
  };

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
                setPaymentError("");

                let result;

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

                  result = await response.json();

                  if (!response.ok || !result.success)
                    throw new Error(
                      result.message || "Payment confirmation failed",
                    );
                } catch (error) {
                  console.error("Payment confirmation error:", error);

                  try {
                    //check if PayPal already completed the payment
                    result = await recoveryPayment(data.orderID);
                  } catch (recoveryError) {
                    console.error("Payment recovery error:", recoveryError);

                    setPaymentError(
                      "We couldn't confirm your payment. " +
                        "Please check your order status before trying again.",
                    );
                    return;
                  }
                }

                //payment completed or recovered successfully
                navigate("/paymentSuccess", {
                  replace: true,
                  state: {
                    order_id: result.order_id,
                  },
                });

                try {
                  await getCartAmount();
                } catch (error) {
                  console.error("Couldn't update cart:", error);
                }
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
