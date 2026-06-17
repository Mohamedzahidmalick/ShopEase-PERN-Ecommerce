import { createContext, useState, useContext } from "react";
import api from "../services/Api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartCount, setCartCount] = useState(0);

  const increaseCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const decreaseCart = () => {
    setCartCount((prev) => Math.max(prev - 1, 0));
  };

   const refreshCart = async () => {
    try {
      const res = await api.get("/cart/count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("buyer_token")}`,
        },
      });

      setCartCount(res.data.count);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, increaseCart, decreaseCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);