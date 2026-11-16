import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

//creating a cart context which will save all the info which will be shared with other components
const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading } = useAuth(); //gettings all the user info (session) from the useAuth context

  const [totalItems, setTotalItems] = useState(0); //the amount of cart items (starts with 0)

  //gets all the cart info (cart items- including the front imgs, total items count and total price of all the items in the cart)
  async function getCartAmount() {
    try {
      const response = await fetch("/api/cart/getCart", {
        method: "GET",
      });
      if (!response.ok) return;

      const data = await response.json();
      setTotalItems(Number(data.total_items) || 0);
    } catch (error) {
      console.error("Error getting cart amount: ", error);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (user?.role === "Client") getCartAmount();
    else setTotalItems(0);
  }, [user?.role, loading]);

  //returning to all the components which will use this cartContext the info of the total amount of items in the cart and the total price of all the items in the cart
  return (
    <CartContext.Provider value={{ totalItems, getCartAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
