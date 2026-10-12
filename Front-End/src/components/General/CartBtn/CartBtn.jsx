import { FiShoppingBag } from "react-icons/fi";
import { useState } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import Cart from "../../Shop-Page/CartWindow/Cart/Cart.jsx";
import styles from "./cartBtn.module.css";

function CartBtn() {
  const [showCart, setShowCart] = useState(false);
  const { totalItems, getCartAmount } = useCart();

  return (
    <div>
      <button
        type="button"
        className={styles.cart}
        onClick={() => {
          getCartAmount();
          setShowCart(true);
        }}
      >
        <FiShoppingBag />
        {totalItems > 0 && (
          <span className={styles.cartCount}>{totalItems}</span>
        )}
      </button>

      {showCart && (
        <div
          className={styles.overlay}
          onClick={() => {
            getCartAmount();
            setShowCart(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Cart
              onClose={() => {
                getCartAmount();
                setShowCart(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CartBtn;
