//client/src/App.jsx
import { Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import ProductDetails from "./pages/ProductDetails";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminProducts from "./pages/AdminProducts";

import RequireAdmin from "./components/RequireAdmin.jsx";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN */}
        <Route
          path="/admin/products"
          element={
            <RequireAdmin>
              <AdminProducts />
            </RequireAdmin>
          }
        />
      </Routes>
    </CartProvider>
  );
}
