import { FiShoppingBag } from "react-icons/fi";
import styles from "./cartBtn.module.css";

function CartBtn() {
  return (
    <button className={styles.cart}>
      <FiShoppingBag />
    </button>
  );
}

export default CartBtn;
