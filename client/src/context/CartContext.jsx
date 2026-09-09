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
const GUEST_CART_KEY = "easyLifeGuestCart";

function readGuestCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.productId && Number.isInteger(item.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const quantityTimers = useRef(new Map());
  const cartRequestId = useRef(0);
  const addingProductIds = useRef(new Set());
  const { token } = useAuth();

  async function loadCart() {
    const requestId = ++cartRequestId.current;
    setLoading(true);

    if (!token) {
      setCart(readGuestCart());
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
            price: Number(productObj.salePrice) >= 0 && Number(productObj.salePrice) < Number(productObj.price || 0)
              ? Number(productObj.salePrice)
              : Number(productObj.price || 0),
            quantity: item.quantity,
            deliveryCategory: productObj.deliveryCategory || "",
            category: productObj.category || "",
          };
        })
        .filter(Boolean);

      // Do not allow a cart request started before logout (or an account switch)
      // to put a previous customer's cart back on screen.
      if (requestId === cartRequestId.current) {
        setCart(formatted);
      }
    } catch (err) {
      if (requestId === cartRequestId.current) {
        console.error(err);
      }
    } finally {
      if (requestId === cartRequestId.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadCart();
  }, [token]);

  async function addToCart(product, quantity = 1) {
    const productId = product?._id;
    if (!productId) {
      return { success: false, message: "This product is unavailable." };
    }

    // A rapid double-click must not create two add requests.
    if (addingProductIds.current.has(productId)) {
      return { success: false, message: "This product is already being added." };
    }

    addingProductIds.current.add(productId);

    try {
      if (!token) {
        const guestItem = {
          productId,
          name: product.name || "",
          image: product.coverImage || "",
          price: Number(product.salePrice) >= 0 && Number(product.salePrice) < Number(product.price || 0)
            ? Number(product.salePrice)
            : Number(product.price || 0),
          quantity: Math.max(1, Number(quantity) || 1),
          category: product.category || "",
        };
        setCart((current) => {
          const existing = current.find((item) => item.productId === productId);
          const next = existing
            ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + guestItem.quantity } : item)
            : [...current, guestItem];
          saveGuestCart(next);
          return next;
        });
        return { success: true };
      }

      await addToCartApi(token, productId, quantity);
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
    } finally {
      addingProductIds.current.delete(productId);
    }
  }

  async function removeFromCart(productId) {
    if (!token) {
      setCart((current) => {
        const next = current.filter((item) => item.productId !== productId);
        saveGuestCart(next);
        return next;
      });
      return;
    }

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

    if (!token) {
      setCart((current) => {
        const next = current.map((item) => item.productId === productId ? { ...item, quantity } : item);
        saveGuestCart(next);
        return next;
      });
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
    if (!token) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart([]);
      return;
    }

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
