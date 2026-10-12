import styles from "./cart.module.css";
import { useEffect, useState } from "react";
import Amount from "../Amount/Amount.jsx";
import Line from "../CartLine/Line/Line.jsx";
import CartTotal from "../CartTotal/CartTotal.jsx";
import { useCart } from "../../../../context/CartContext.jsx";
function Cart({ onClose }) {
  const [cart, setCart] = useState({
    order_id: null,
    items: [],
    total_items: 0,
    total_price: 0,
  });
  const { getCartAmount } = useCart();

  async function getCart() {
    try {
      const response = await fetch("/api/cart/getCart", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error getting cart:", error);
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  async function updateQuantity(product_id, newQuantity) {
    try {
      const response = await fetch("/api/cart/updateQuantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product_id,
          quantity: newQuantity,
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await getCart();
      await getCartAmount();
    } catch (error) {
      console.error("Error updating product quantity: ", error);
    }
  }

  async function removeProduct(product_id) {
    try {
      const response = await fetch("/api/cart/removeProduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await getCart();
      await getCartAmount();
    } catch (error) {
      console.error("Error removing product from cart: ", error);
    }
  }
  return (
    <div className={styles.cart}>
      <Amount amount={cart.total_items} onClose={onClose} />

      <div className={styles.products}>
        {cart.items.map((product) => (
          <Line
            key={product.product_id}
            product_id={product.product_id}
            image={product.image}
            name={product.product_name}
            price={product.product_price}
            quantity={product.quantity}
            onQuantityChange={updateQuantity}
            onRemoveProduct={removeProduct}
          />
        ))}
      </div>

      <CartTotal
        total={Number(cart.total_price)}
        disabled={Number(cart.total_items === 0)}
      />
    </div>
  );
}

export default Cart;
