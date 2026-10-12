import styles from "./cartTotal.module.css";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";

function CartTotal({ total, disabled }) {
  return (
    <div className={styles.cartTotal}>
      <div className={styles.totalRow}>
        <span className={styles.totalText}>TOTAL</span>
        <span className={styles.price}>${total}</span>
      </div>

      <GeneralBtn text="CHECKOUT" disabled={disabled} />
    </div>
  );
}

export default CartTotal;
