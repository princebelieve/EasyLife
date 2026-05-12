//client/src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("newbrend-cart");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("newbrend-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product._id);

      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.coverImage,
          price: Number(product.price || 0),
          quantity,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
