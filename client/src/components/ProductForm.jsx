// src/components/ProductForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductForm({
  onSubmit,
  editingProduct,
  onCancelEdit,
}) {
  const emptyPiece = {
    name: "",
    dimensions: "",
    material: "",
    description: "",
    price: 0,
  };

  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    price: "",
    stock: 0,
    shippingClass: "furniture",
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
      setForm({
        name: editingProduct.name ?? "",
        shortDescription: editingProduct.shortDescription ?? "",
        fullDescription: editingProduct.fullDescription ?? "",
        category: editingProduct.category ?? "",
        price: editingProduct.price ?? "",
        stock: editingProduct.stock ?? 0,
        shippingClass: editingProduct.shippingClass ?? "furniture",
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
                price: p.price ?? 0,
                existingImage: p.image ?? "",
              }))
            : [{ ...emptyPiece }],
      });

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
        stock: 0,
        shippingClass: "furniture",
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

      formData.append("shippingClass", form.shippingClass);

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
          shippingClass: "furniture",
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
    <form onSubmit={handleSubmit} className="form">
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <input
        name="name"
        placeholder="Product or project name"
        value={form.name}
        onChange={handleChange}
      />

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

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select Category</option>

        <option value="Sofa Set">Sofa Set</option>

        <option value="Dining Set">Dining Set</option>

        <option value="Kitchen Cabinet">Kitchen Cabinet</option>

        <option value="Wall Panel">Wall Panel</option>

        <option value="TV Console">TV Console</option>

        <option value="Curtains & Bedsheets">Curtains & Bedsheets</option>

        <option value="Lighting & Fittings">Lighting & Fittings</option>

        <option value="Bedroom Furniture">Bedroom Furniture</option>

        <option value="Office Furniture">Office Furniture</option>

        <option value="Interior Design">Interior Design</option>

        <option value="Custom Project">Custom Project</option>
      </select>

      <input
        name="price"
        type="number"
        placeholder="Base price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock Quantity"
        value={form.stock}
        onChange={handleChange}
      />

      <input
        name="weight"
        type="number"
        placeholder="Weight (kg)"
        value={form.weight}
        onChange={handleChange}
      />

      <input
        name="deliveryEstimate"
        placeholder="Delivery Estimate"
        value={form.deliveryEstimate}
        onChange={handleChange}
      />

      <select
        name="shippingClass"
        value={form.shippingClass}
        onChange={handleChange}
      >
        <option value="light">Light Decor</option>

        <option value="medium">Medium Item</option>

        <option value="heavy">Heavy Item</option>

        <option value="furniture">Large Furniture</option>

        <option value="decor">Decor & Fittings</option>

        <option value="installation">Installation Service</option>

        <option value="custom">Custom Interior Project</option>
      </select>

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
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
        Featured Product
      </label>

      <div>
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

      <div>
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

      <hr />

      <h3>Included Items / Components</h3>

      {form.pieces.map((piece, index) => (
        <div key={index} className="piece-card">
          <input
            placeholder="Item or component name"
            value={piece.name}
            onChange={(e) => handlePieceChange(index, "name", e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handlePieceChange(index, "imageFile", e.target.files[0])
            }
          />

          <input
            placeholder="Dimensions"
            value={piece.dimensions}
            onChange={(e) =>
              handlePieceChange(index, "dimensions", e.target.value)
            }
          />

          <input
            placeholder="Description"
            value={piece.description}
            onChange={(e) =>
              handlePieceChange(index, "description", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={piece.price}
            onChange={(e) => handlePieceChange(index, "price", e.target.value)}
          />

          <button
            type="button"
            className="btn-danger"
            onClick={() => removePiece(index)}
          >
            Remove Piece
          </button>
        </div>
      ))}

      <button type="button" onClick={addPiece}>
        Add Another Piece
      </button>

      {uploadMessage && <div className="upload-status">{uploadMessage}</div>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isUploading}>
          {isUploading
            ? editingProduct
              ? "Updating..."
              : "Uploading..."
            : editingProduct
              ? "Update Product"
              : "Add Product"}
        </button>

        {editingProduct && (
          <button type="button" onClick={onCancelEdit} className="btn-danger">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
