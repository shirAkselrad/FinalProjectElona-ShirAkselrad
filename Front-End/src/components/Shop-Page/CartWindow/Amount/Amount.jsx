import styles from "./amount.module.css";

import Remove from "../../../General/Remove/Remove.jsx";

function Amount({ amount, onClose }) {
  return (
    <div className={styles.amount}>
      <p className={styles.title}>
        YOUR CART <span>({amount})</span>
      </p>

      <Remove onClick={onClose} />
    </div>
  );
}

export default Amount;
