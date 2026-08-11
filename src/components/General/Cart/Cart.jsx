import { FiShoppingBag } from "react-icons/fi";
import styles from "./cart.module.css";

function Cart() {
  return (
    <button className={styles.cart}>
      <FiShoppingBag />
    </button>
  );
}

export default Cart;
