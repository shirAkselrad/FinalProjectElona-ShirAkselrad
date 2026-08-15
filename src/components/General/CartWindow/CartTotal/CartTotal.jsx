import styles from "./cartTotal.module.css";
import GeneralBtn from "../../GeneralBtn/GeneralBtn.jsx"

function CartTotal({ total }) {
  return (
    <div className={styles.cartTotal}>
      <div className={styles.totalRow}>
        <span className={styles.totalText}>TOTAL</span>
        <span className={styles.price}>${total}</span>
      </div>

      <GeneralBtn text="CHECKOUT" />
    </div>
  );
}

export default CartTotal;
