//client/src/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";

import {
  createTestimonialApi,
  deleteTestimonialApi,
  getAdminOrders,
  getAdminTestimonials,
  getProducts,
} from "../services/api";

import { getToken } from "../utils/auth";

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
        const [productsData, ordersData, contentData] = await Promise.all([
          getProducts(),
          getAdminOrders(getToken()),
          getAdminTestimonials(getToken()),
        ]);

        setProducts(productsData);
        setOrders(ordersData);
        setItems(
          Array.isArray(contentData)
            ? contentData.filter((item) => item.featured)
            : [],
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  const paidOrders = orders.filter((order) => order?.paymentStatus === "paid");

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );

  const lowStock = products.filter((p) => p.stock <= 5);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setStatus("Please choose an image or video first.");
      return;
    }

    setStatus("Uploading media…");
    const data = new FormData();
    data.append("contentType", "story");
    data.append("title", title.trim() || "Homepage media");
    data.append("name", "Easy Life Wellness Hub");
    data.append("testimony", caption.trim() || "Added from the admin panel.");
    data.append("featured", "true");
    data.append("approved", "true");
    data.append("status", "active");
    data.append(mediaType === "video" ? "video" : "image", file);

    try {
      const saved = await createTestimonialApi(data, getToken());
      setItems((current) => [saved, ...current]);
      setStatus("Saved and published on the home page.");
      setTitle("");
      setCaption("");
      setFile(null);
      event.target.reset();
    } catch (error) {
      console.error("Unable to upload homepage media", error);
      setStatus(error.message || "The media could not be uploaded.");
    }
  }

  async function handleRemove(id) {
    if (!window.confirm("Remove this media from the home page?")) return;

    try {
      await deleteTestimonialApi(id, getToken());
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Unable to delete homepage media", error);
      setStatus(error.message || "The media could not be removed.");
    }
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
          Upload images and videos here. They are stored securely and shown in
          the Home page media section.
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

      <div className="admin-media-panel admin-home-media-panel">
        <h2>Homepage Media</h2>
        <p>
          Upload a photo or video here and it will appear in the home page media
          section.
        </p>

        <form className="admin-media-form" onSubmit={handleSubmit}>
          <div className="admin-media-form-grid">
            <label>
              <span>Media title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Healthy living workshop"
              />
            </label>

            <label>
              <span>Media type</span>
              <select
                value={mediaType}
                onChange={(event) => setMediaType(event.target.value)}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
          </div>

          <label>
            <span>Caption</span>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Briefly describe what visitors are seeing"
              rows="3"
            />
          </label>

          <label className="admin-media-file-field">
            <span>Choose {mediaType === "video" ? "video" : "image"}</span>
            <input
              type="file"
              accept={mediaType === "video" ? "video/*" : "image/*"}
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <small>{file ? file.name : mediaType === "video" ? "Video files up to 100 MB" : "Choose an image to upload"}</small>
          </label>

          <button type="submit" className="admin-media-submit">Save to Home Page</button>
        </form>

        {status && <p className="upload-status">{status}</p>}

        <div className="admin-media-list">
          {items.map((item) => (
            <div key={item._id} className="admin-media-item">
              {item.videoFile ? (
                <video src={item.videoFile} controls preload="metadata" />
              ) : (
                <img src={item.image} alt={item.title} />
              )}

              <div>
                <strong>{item.title}</strong>
                <p>{item.testimony}</p>
                <button type="button" onClick={() => handleRemove(item._id)}>
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
