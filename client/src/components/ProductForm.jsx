// src/components/ProductForm.jsx
import { useEffect, useState } from "react";

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

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    coverImage: null,
    gallery: [],
    pieces: [emptyPiece],
  });

  useEffect(() => {
    if (!editingProduct) return;

    setForm({
      name: editingProduct.name || "",
      description: editingProduct.description || "",
      category: editingProduct.category || "",
      price: editingProduct.price || "",
      coverImage: null,
      gallery: [],
      pieces:
        editingProduct.pieces?.length > 0
          ? editingProduct.pieces.map((p) => ({
              name: p.name || "",
              dimensions: p.dimensions || "",
              material: p.material || "",
              description: p.description || "",
              price: p.price || 0,
            }))
          : [emptyPiece],
    });
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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", Number(form.price));

    if (form.coverImage instanceof File) {
      formData.append("coverImage", form.coverImage);
    }

    if (Array.isArray(form.gallery)) {
      form.gallery.forEach((file) => formData.append("gallery", file));
    }

    const piecesData = form.pieces.map((piece) => ({
      name: piece.name,
      material: piece.material,
      dimensions: piece.dimensions,
      description: piece.description,
      price: Number(piece.price || 0),
    }));

    formData.append("pieces", JSON.stringify(piecesData));

    form.pieces.forEach((piece) => {
      if (piece.imageFile instanceof File) {
        formData.append("pieceImages", piece.imageFile);
      }
    });

    await onSubmit(formData);

    if (!editingProduct) {
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        coverImage: null,
        gallery: [],
        pieces: [{ ...emptyPiece }],
      });

      e.target.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <input
        name="name"
        placeholder="Collection name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />

      <input
        name="price"
        type="number"
        placeholder="Starting price"
        value={form.price}
        onChange={handleChange}
        required
      />

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

      <h3>Furniture Pieces</h3>

      {form.pieces.map((piece, index) => (
        <div key={index} className="piece-card">
          <input
            placeholder="Piece name"
            value={piece.name}
            onChange={(e) => handlePieceChange(index, "name", e.target.value)}
            required
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

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingProduct ? "Update Product" : "Add Product"}
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
