// src/pages/AdminProducts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

import {
  getProducts,
  deleteProductApi,
  getAdminProducts,
  approveProductApi,
  rejectProductApi,
} from "../services/api";
import { getToken } from "../utils/auth";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { isAdminOrSubadmin } = useAuth();
  const { isAdmin } = useAuth();

  async function loadProducts() {
    try {
      let data;

      if (isAdminOrSubadmin) {
        data = await getAdminProducts(getToken());
      } else {
        data = await getProducts();
      }

      setProducts(Array.isArray(data) ? data : data || []);
    } catch (err) {
      console.error("Unable to load products", err);
      setProducts([]);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminOrSubadmin]);

  async function handleDelete(id) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      await deleteProductApi(id, getToken());
    } catch (err) {
      alert(err.message || "Unable to delete product");
      return;
    }

    loadProducts();
  }

  async function handleApprove(id) {
    try {
      await approveProductApi(id, getToken());
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to approve");
    }
  }

  async function handleReject(id) {
    try {
      await rejectProductApi(id, getToken());
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to reject");
    }
  }

  return (
    <>
      <div className="page">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1>Admin Products</h1>
            <p style={{ marginTop: 8, color: "#555" }}>
              Manage product catalog and edit existing listings from the product
              grid.
            </p>
          </div>

          <button type="button" onClick={() => navigate("/admin/products/new")}>
            Add Product
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            marginTop: 30,
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                padding: 20,
                borderRadius: 8,
                background: "#fff",
              }}
            >
              {product.coverImage ? (
                <img
                  src={product.coverImage}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginBottom: 12,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 6,
                    marginBottom: 12,
                    background: "#f3f3f3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: 14,
                  }}
                >
                  No Image
                </div>
              )}

              <h3>{product.name}</h3>
              <p>₦{Number(product.price || 0).toLocaleString()}</p>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/products/edit/${product._id}`)
                  }
                >
                  Edit
                </button>

                {product.pendingApproval && (
                  <span style={{ color: "#b36", fontWeight: 600 }}>
                    Pending Approval
                  </span>
                )}

                {product.pendingDeletion && (
                  <span style={{ color: "#b36", fontWeight: 600 }}>
                    Pending Deletion
                  </span>
                )}

                {isAdmin && product.pendingApproval && (
                  <>
                    <button onClick={() => handleApprove(product._id)}>
                      Approve
                    </button>
                    <button onClick={() => handleReject(product._id)}>
                      Reject
                    </button>
                  </>
                )}

                <button type="button" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
