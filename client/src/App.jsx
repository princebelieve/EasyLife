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
import RequireAuth from "./components/RequireAuth.jsx";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminSales from "./pages/AdminSales";
import AdminStockAlerts from "./pages/AdminStockAlerts";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminDeliveryBoard from "./pages/AdminDeliveryBoard";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

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
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/products"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminOrderDetails />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminSales />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/stock"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminStockAlerts />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/delivery"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminDeliveryBoard />
              </AdminLayout>
            </RequireAdmin>
          }
        />
      </Routes>
    </CartProvider>
  );
}
