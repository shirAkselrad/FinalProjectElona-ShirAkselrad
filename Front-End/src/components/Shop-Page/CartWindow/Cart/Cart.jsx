import styles from "./cart.module.css";
import { useEffect, useState } from "react";
import Amount from "../Amount/Amount.jsx";
import Line from "../CartLine/Line/Line.jsx";
import CartTotal from "../CartTotal/CartTotal.jsx";
import { useCart } from "../../../../context/CartContext.jsx";
function Cart({ onClose }) {
  // all cart info
  const [cart, setCart] = useState({
    order_id: null,
    items: [],
    total_items: 0,
    total_price: 0,
  });

  const { getCartAmount } = useCart(); //getting cart amount from useCart (cart items- including the front imgs, total items count and total price of all the items in the cart)

  //order id
  // all the cart items info including front img
  //total amount of items in the cart
  //total price of all items in the cart
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

  //updates the new quantity of the requested products, returns the count of all items in the cart and the total price of all cart (just the products)
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
      //refreshing the FE
      await getCart();
      await getCartAmount();
    } catch (error) {
      console.error("Error updating product quantity: ", error);
    }
  }

  //removing the unwanted product from the cart (if there is no single product in the cart, the cart gets deleted in BE )
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
      //refreshing FE
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
            price={product.original_price}
            discount={product.discount}
            quantity={product.quantity}
            onQuantityChange={updateQuantity}
            onRemoveProduct={removeProduct}
          />
        ))}
      </div>

      <CartTotal
        total={Number(cart.total_price)}
        disabled={Number(cart.total_items) === 0}
        onClose={onClose}
      />
    </div>
  );
}

export default Cart;
