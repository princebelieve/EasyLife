// src/pages/AdminProducts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts, deleteProductApi } from "../services/api";
import { getToken } from "../utils/auth";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  async function loadProducts() {
    const data = await getProducts();

    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

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

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/products/edit/${product._id}`)
                  }
                >
                  Edit
                </button>

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
