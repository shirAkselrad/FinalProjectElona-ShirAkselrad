import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from "./paymentPage.module.css";

function PaymentPage() {
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
          <PayPalScriptProvider
            options={{
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
              currency: "ILS",
              intent: "capture",
            }}
          >
            <PayPalButtons
              style={{
                layout: "vertical",
                shape: "rect",
                label: "paypal",
                height: 48,
              }}
              createOrder={async () => {
                const response = await fetch("/api/payment/createOrder", {
                  method: "POST",
                  credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                return data.paypal_order_id;
              }}
              onApprove={async (data) => {
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

                if (!response.ok) throw new Error(result.message);

                console.log("Payment completed successfully:", result);
              }}
              onError={(error) => {
                console.error("PayPal payment error:", error);
              }}
            />
          </PayPalScriptProvider>
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
