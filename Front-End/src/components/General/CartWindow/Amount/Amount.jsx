import styles from "./amount.module.css";

import Remove from "../../CartWindow/CartLine/Remove/Remove.jsx";

function Amount({ amount }) {
  return (
    <div className={styles.amount}>
      <p className={styles.title}>
        YOUR CART <span>({amount})</span>
      </p>

      <Remove />
    </div>
  );
}

export default Amount;
