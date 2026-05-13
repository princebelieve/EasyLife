// src/pages/AdminProducts.jsx
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

import {
  getProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../services/api";

import { getToken } from "../utils/auth";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  async function loadProducts() {
    const data = await getProducts();

    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(formData) {
    let data;

    try {
      data = editingProduct
        ? await updateProductApi(editingProduct._id, formData, getToken())
        : await createProductApi(formData, getToken());
    } catch (err) {
      alert(err.message || "Unable to save product");
      throw err;
    }

    await loadProducts();
    setEditingProduct(null);

    return data.product || data;
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      await deleteProductApi(id, getToken());
    } catch (err) {
      alert(err.message || "Unable to delete product");
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
              <p>₦{Number(product.price || 0).toLocaleString()}</p>

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
