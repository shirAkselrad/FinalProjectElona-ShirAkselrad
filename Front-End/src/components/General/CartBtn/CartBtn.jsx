import { FiShoppingBag } from "react-icons/fi";
import { useState } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import Cart from "../../Shop-Page/CartWindow/Cart/Cart.jsx";
import styles from "./cartBtn.module.css";

function CartBtn() {
  //controls rather the cart window will be displayed or not
  const [showCart, setShowCart] = useState(false);
  //the amount of items in the cart

  //total items- order id, all cart items (include cart front img), total count of items in the cart, total price of all the items
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
