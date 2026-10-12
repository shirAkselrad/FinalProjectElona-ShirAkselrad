import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [totalItems, setTotalItems] = useState(0);

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

  return (
    <CartContext.Provider value={{ totalItems, getCartAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
