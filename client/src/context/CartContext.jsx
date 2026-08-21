//client/src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import useAuth from "./AuthContext";
import {
  getCart,
  addToCartApi,
  removeFromCartApi,
  updateCartApi,
  clearCartApi,
} from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const quantityTimers = useRef(new Map());
  const { token } = useAuth();

  async function loadCart() {
    setLoading(true);

    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getCart(token);

      const formatted = (data.items || [])
        .map((item) => {
          const p = item.productId;

          if (!p) return null;

          const productObj = typeof p === "object" ? p : { _id: p };

          return {
            productId: productObj._id || productObj,
            name: productObj.name || "",
            image: productObj.coverImage || "",
            price: Number(productObj.price || 0),
            quantity: item.quantity,
            deliveryCategory: productObj.deliveryCategory || "",
            category: productObj.category || "",
          };
        })
        .filter(Boolean);

      setCart(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, [token]);

  async function addToCart(product, quantity = 1) {
    if (!token) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    try {
      await addToCartApi(token, product._id, quantity);
      await loadCart();
      return {
        success: true,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err?.message || "Failed to add item to cart.",
      };
    }
  }

  async function removeFromCart(productId) {
    try {
      await removeFromCartApi(token, productId);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCart((current) => current.map((item) => item.productId === productId ? { ...item, quantity } : item));

    const previousTimer = quantityTimers.current.get(productId);
    if (previousTimer) window.clearTimeout(previousTimer);

    const timer = window.setTimeout(async () => {
      try {
        await updateCartApi(token, productId, quantity);
      } catch (err) {
        console.error(err);
        await loadCart();
      } finally {
        quantityTimers.current.delete(productId);
      }
    }, 300);

    quantityTimers.current.set(productId, timer);
  }

  async function clearCart() {
    try {
      await clearCartApi(token);
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  }

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
