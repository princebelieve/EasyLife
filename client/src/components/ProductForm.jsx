// src/components/ProductForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PRODUCT_CATEGORY_OPTIONS from "../config/productCategoryOptions";

const emptyPiece = {
  name: "",
  dimensions: "",
  material: "",
  description: "",
  price: "",
};

export default function ProductForm({
  onSubmit,
  editingProduct,
  onCancelEdit,
}) {
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [step, setStep] = useState(1);
  const [allowNewCategory, setAllowNewCategory] = useState(false);

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    price: "",
    stock: 0,
    featured: false,
    status: "active",
    weight: 0,
    deliveryEstimate: "7-14 days",
    coverImage: null,
    gallery: [],
    pieces: [emptyPiece],
  });

  useEffect(() => {
    if (editingProduct) {
      const isCustomCategory =
        editingProduct.category &&
        !PRODUCT_CATEGORY_OPTIONS.includes(editingProduct.category);

      setForm({
        name: editingProduct.name ?? "",
        shortDescription: editingProduct.shortDescription ?? "",
        fullDescription: editingProduct.fullDescription ?? "",
        category: editingProduct.category ?? "",
        price: editingProduct.price ?? "",
        stock: editingProduct.stock ?? "",
        featured: editingProduct.featured ?? false,
        status: editingProduct.status ?? "active",
        sku: editingProduct.sku ?? "",
        weight: editingProduct.weight ?? 0,
        deliveryEstimate: editingProduct.deliveryEstimate ?? "7-14 days",
        coverImage: null,
        gallery: [],
        pieces:
          editingProduct.pieces?.length > 0
            ? editingProduct.pieces.map((p) => ({
                name: p.name ?? "",
                dimensions: p.dimensions ?? "",
                material: p.material ?? "",
                description: p.description ?? "",
                price: p.price ?? "",
                existingImage: p.image ?? "",
              }))
            : [{ ...emptyPiece }],
      });

      setAllowNewCategory(Boolean(isCustomCategory));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setForm({
        name: "",
        shortDescription: "",
        fullDescription: "",
        category: "",
        price: "",
        stock: "",
        featured: false,
        status: "active",
        weight: 0,
        deliveryEstimate: "7-14 days",
        coverImage: null,
        gallery: [],
        pieces: [{ ...emptyPiece }],
      });
    }
  }, [editingProduct]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handlePieceChange(index, field, value) {
    const updated = [...form.pieces];

    updated[index][field] = value;

    setForm({
      ...form,
      pieces: updated,
    });
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, 5));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function addPiece() {
    setForm({
      ...form,
      pieces: [...form.pieces, { ...emptyPiece }],
    });
  }

  function removePiece(index) {
    const updated = form.pieces.filter((_, i) => i !== index);

    setForm({
      ...form,
      pieces: updated.length ? updated : [{ ...emptyPiece }],
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsUploading(true);
      setUploadMessage(
        editingProduct ? "Updating product..." : "Uploading product...",
      );

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("shortDescription", form.shortDescription);
      formData.append("fullDescription", form.fullDescription);
      formData.append("category", form.category);

      formData.append("price", Number(form.price || 0));
      formData.append("stock", Number(form.stock || 0));

      formData.append("featured", form.featured);

      formData.append("status", form.status);

      formData.append("weight", Number(form.weight || 0));

      formData.append("deliveryEstimate", form.deliveryEstimate);

      if (form.coverImage instanceof File) {
        formData.append("coverImage", form.coverImage);
      }

      if (Array.isArray(form.gallery)) {
        form.gallery.forEach((file) => formData.append("gallery", file));
      }

      const piecesData = form.pieces
        .filter(
          (piece) =>
            piece.name ||
            piece.material ||
            piece.dimensions ||
            piece.description ||
            piece.imageFile,
        )
        .map((piece) => ({
          name: piece.name || "",
          material: piece.material || "",
          dimensions: piece.dimensions || "",
          description: piece.description || "",
          price: Number(piece.price || 0),
          image: piece.existingImage || "",
        }));

      formData.append("pieces", JSON.stringify(piecesData));

      form.pieces.forEach((piece) => {
        if (piece.imageFile instanceof File) {
          formData.append("pieceImages", piece.imageFile);
        }
      });

      const savedProduct = await onSubmit(formData);

      // notify other parts of the app that product categories may have changed
      try {
        const event = new CustomEvent("products:changed", {
          detail: { product: savedProduct },
        });
        window.dispatchEvent(event);
      } catch {
        // ignore in non-browser contexts
      }

      setUploadMessage(
        editingProduct
          ? "Product updated successfully"
          : "Product uploaded successfully",
      );

      if (!editingProduct) {
        setForm({
          name: "",
          shortDescription: "",
          fullDescription: "",
          category: "",
          price: "",
          stock: 0,
          featured: false,
          status: "active",
          weight: 0,
          deliveryEstimate: "7-14 days",
          coverImage: null,
          gallery: [],
          pieces: [{ ...emptyPiece }],
        });

        e.target.reset();
      }

      if (editingProduct) {
        setUploadMessage("Product updated successfully");

        window.scrollTo({
          top: 500,
          behavior: "smooth",
        });
      } else {
        setTimeout(() => {
          if (savedProduct?._id) {
            navigate(`/product/${savedProduct._id}`);
          } else {
            navigate("/");
          }
        }, 1200);
      }
    } catch (err) {
      console.error(err);

      setUploadMessage("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="product-wizard-shell">
      {/* HEADER */}
      <div className="wizard-header">
        <div>
          <span className="wizard-label">
            {editingProduct ? "UPDATE MODE" : "NEW PRODUCT"}
          </span>

          <h1>{editingProduct ? "Edit Product" : "Create Product"}</h1>
        </div>

        <div className="wizard-progress">
          <div className={`wizard-dot ${step >= 1 ? "active" : ""}`} />
          <div className={`wizard-dot ${step >= 2 ? "active" : ""}`} />
          <div className={`wizard-dot ${step >= 3 ? "active" : ""}`} />
          <div className={`wizard-dot ${step >= 4 ? "active" : ""}`} />
          <div className={`wizard-dot ${step >= 5 ? "active" : ""}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="wizard-card">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="wizard-step">
            <div className="wizard-step-header">
              <h2>Basic Information</h2>
              <p>Name, descriptions and category.</p>
            </div>

            <div className="wizard-grid">
              <input
                name="name"
                placeholder="Product or project name"
                value={form.name}
                onChange={handleChange}
              />

              {allowNewCategory ? (
                <input
                  name="category"
                  placeholder="Enter custom category"
                  value={form.category}
                  onChange={handleChange}
                  autoFocus
                />
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {PRODUCT_CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}

              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  id="allow-new-category"
                  checked={allowNewCategory}
                  onChange={(e) => {
                    setAllowNewCategory(e.target.checked);
                    if (!e.target.checked) {
                      setForm((prev) => ({ ...prev, category: "" }));
                    }
                  }}
                />
                <label htmlFor="allow-new-category" style={{ margin: 0 }}>
                  Create new product category
                </label>
              </div>

              <p
                style={{
                  margin: "0 0 12px",
                  color: "#555",
                  fontSize: "0.95rem",
                }}
              >
                Choose an existing category from the list, or enable the custom
                category option to type a new one.
              </p>
            </div>

            <textarea
              name="shortDescription"
              placeholder="Short description"
              value={form.shortDescription}
              onChange={handleChange}
            />

            <textarea
              name="fullDescription"
              placeholder="Full description"
              value={form.fullDescription}
              onChange={handleChange}
            />
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="wizard-step">
            <div className="wizard-step-header">
              <h2>Pricing & Inventory</h2>
              <p>Pricing, stock and delivery settings.</p>
            </div>

            <div className="wizard-grid">
              <input
                name="price"
                type="number"
                min="0"
                placeholder="Base Price"
                value={form.price}
                onChange={handleChange}
              />

              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Stock Quantity"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            <input
              name="deliveryEstimate"
              placeholder="Delivery estimate"
              value={form.deliveryEstimate}
              onChange={handleChange}
            />

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <label className="wizard-checkbox">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({
                    ...form,
                    featured: e.target.checked,
                  })
                }
              />

              <span>Featured Product</span>
            </label>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="wizard-step">
            <div className="wizard-step-header">
              <h2>Images & Gallery</h2>
              <p>Upload your product visuals.</p>
            </div>

            <div className="upload-box">
              <p>Main Image</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    coverImage: e.target.files[0],
                  })
                }
              />
            </div>

            <div className="upload-box">
              <p>Gallery Images</p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    gallery: Array.from(e.target.files),
                  })
                }
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="wizard-step">
            <div className="wizard-step-header">
              <h2>Included Pieces</h2>
              <p>Configure sofa sets, chairs, tables and components.</p>
            </div>

            {form.pieces.map((piece, index) => (
              <div key={index} className="wizard-piece-card">
                <div className="wizard-grid">
                  <input
                    placeholder="Item name"
                    value={piece.name}
                    onChange={(e) =>
                      handlePieceChange(index, "name", e.target.value)
                    }
                  />

                  <input
                    placeholder="Dimensions"
                    value={piece.dimensions}
                    onChange={(e) =>
                      handlePieceChange(index, "dimensions", e.target.value)
                    }
                  />
                </div>

                <div className="wizard-grid">
                  <input
                    type="number"
                    placeholder="Price"
                    value={piece.price}
                    onChange={(e) =>
                      handlePieceChange(index, "price", e.target.value)
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handlePieceChange(index, "imageFile", e.target.files[0])
                    }
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={piece.description}
                  onChange={(e) =>
                    handlePieceChange(index, "description", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="remove-piece-btn"
                  onClick={() => removePiece(index)}
                >
                  Remove Item
                </button>
              </div>
            ))}

            <button type="button" className="add-piece-btn" onClick={addPiece}>
              + Add Another Item
            </button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="wizard-step">
            <div className="wizard-step-header">
              <h2>Review & Publish</h2>
              <p>Confirm everything before upload.</p>
            </div>

            <div className="review-card">
              <h3>{form.name || "Untitled Product"}</h3>

              <p>{form.category || "No category selected"}</p>

              <strong>₦{Number(form.price || 0).toLocaleString()}</strong>
            </div>

            {uploadMessage && (
              <div className="upload-status">{uploadMessage}</div>
            )}
          </div>
        )}

        {/* NAVIGATION */}
        <div className="wizard-actions">
          {step > 1 && (
            <button
              type="button"
              className="wizard-secondary-btn"
              onClick={prevStep}
            >
              Back
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              className="wizard-primary-btn"
              onClick={nextStep}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="wizard-primary-btn"
              disabled={isUploading}
            >
              {isUploading
                ? "Uploading..."
                : editingProduct
                  ? "Update Product"
                  : "Publish Product"}
            </button>
          )}

          {editingProduct && (
            <button
              type="button"
              className="wizard-danger-btn"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
