//client/src/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";

import { getProducts, getAdminOrders } from "../services/api";

import { getToken } from "../utils/auth";

const STORAGE_KEY = "easylife-home-media";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, ordersData] = await Promise.all([
          getProducts(),
          getAdminOrders(getToken()),
        ]);

        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      setItems([]);
    }
  }, []);

  const paidOrders = orders.filter((order) => order?.paymentStatus === "paid");

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );

  const lowStock = products.filter((p) => p.stock <= 5);

  function saveItems(nextItems) {
    setItems(nextItems);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setStatus("Please choose an image or video first.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const nextItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: mediaType,
        title: title.trim() || "Homepage media",
        caption: caption.trim() || "Added from the admin panel.",
        src: reader.result,
      };

      const nextItems = [nextItem, ...items];
      saveItems(nextItems);
      setStatus("Saved to the homepage gallery.");
      setTitle("");
      setCaption("");
      setFile(null);
      event.target.reset();
    };

    reader.readAsDataURL(file);
  }

  function handleRemove(id) {
    const nextItems = items.filter((item) => item.id !== id);
    saveItems(nextItems);
  }

  return (
    <div className="page">
      <div
        className="admin-media-panel"
        style={{
          marginBottom: 24,
          background: "#fff8e8",
          border: "1px solid #e8d8b1",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Homepage Media</h2>
        <p style={{ marginBottom: 0 }}>
          Upload images and videos here. They will appear in the home page
          gallery automatically.
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Products</h3>
          <div className="kpi-value">{products.length}</div>
        </div>

        <div className="kpi-card">
          <h3>Total Orders</h3>
          <div className="kpi-value">{orders.length}</div>
        </div>

        <div className="kpi-card">
          <h3>Total Revenue</h3>
          <div className="kpi-value">₦{totalRevenue.toLocaleString()}</div>
        </div>

        <div className="kpi-card">
          <h3>Low Stock</h3>
          <div className="kpi-value">{lowStock.length}</div>
        </div>
      </div>

      <div className="admin-media-panel">
        <h2>Homepage Media</h2>
        <p>
          Upload a photo or video here and it will appear in the home page media
          section.
        </p>

        <form className="admin-media-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
          />

          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Short caption"
            rows="3"
          />

          <select
            value={mediaType}
            onChange={(event) => setMediaType(event.target.value)}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          <input
            type="file"
            accept={mediaType === "video" ? "video/*" : "image/*"}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />

          <button type="submit">Save to Home Page</button>
        </form>

        {status && <p className="upload-status">{status}</p>}

        <div className="admin-media-list">
          {items.map((item) => (
            <div key={item.id} className="admin-media-item">
              {item.type === "video" ? (
                <video src={item.src} controls />
              ) : (
                <img src={item.src} alt={item.title} />
              )}

              <div>
                <strong>{item.title}</strong>
                <p>{item.caption}</p>
                <button type="button" onClick={() => handleRemove(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
