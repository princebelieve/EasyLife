// src/pages/AdminProducts.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  async function loadProducts() {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(formData) {
    const method = editingProduct ? "PUT" : "POST";

    const url = editingProduct
      ? `${BASE_URL}/api/products/${editingProduct._id}`
      : `${BASE_URL}/api/products`;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Unable to save product");
      throw new Error(data.message || "Unable to save product");
    }

    await loadProducts();
    setEditingProduct(null);

    return data.product || data;
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Unable to delete product");
      return;
    }

    if (editingProduct?._id === id) {
      setEditingProduct(null);
    }

    loadProducts();
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Admin Products</h1>

        <ProductForm
          onSubmit={handleSubmit}
          editingProduct={editingProduct}
          onCancelEdit={() => setEditingProduct(null)}
        />

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
              <p>£{product.price.toLocaleString()}</p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(product)}
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
