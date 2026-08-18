import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PRODUCT_CATEGORY_OPTIONS from "../config/productCategoryOptions";

const initialForm = { name: "", shortDescription: "", fullDescription: "", category: "", price: "", salePrice: "", currency: "NGN", stock: 0, featured: false, status: "active", brand: "", vendor: "", gtin: "", googleProductCategory: "", condition: "new", ingredients: "", directions: "", warnings: "", netContent: "", countryOfOrigin: "", shippingWeight: 0, shippingLength: 0, shippingWidth: 0, shippingHeight: 0, shippingClass: "standard", shipsInternationally: true, coverImage: null, gallery: [] };

export default function ProductForm({ onSubmit, editingProduct, onCancelEdit }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!editingProduct) return setForm(initialForm);
    setForm({ ...initialForm, ...editingProduct, salePrice: editingProduct.salePrice ?? "", coverImage: null, gallery: [] });
  }, [editingProduct]);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
  };

  async function submit(event) {
    event.preventDefault();
    setIsUploading(true); setMessage("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (!["coverImage", "gallery", "_id", "createdAt", "updatedAt", "__v"].includes(key) && value !== null && value !== undefined) data.append(key, value);
      });
      if (form.coverImage instanceof File) data.append("coverImage", form.coverImage);
      form.gallery.forEach((file) => data.append("gallery", file));
      const saved = await onSubmit(data);
      setMessage(editingProduct ? "Product updated successfully." : "Wellness product published successfully.");
      if (!editingProduct) setForm(initialForm);
      setTimeout(() => navigate(saved?._id ? `/product/${saved._id}` : "/collection"), 700);
    } catch (error) { setMessage(error.message || "Product could not be saved."); }
    finally { setIsUploading(false); }
  }

  return <div className="product-wizard-shell"><div className="wizard-header"><div><span className="wizard-label">EASY LIFE WELLNESS SHOP</span><h1>{editingProduct ? "Edit Wellness Product" : "Add Wellness Product"}</h1></div></div><form onSubmit={submit} className="wizard-card"><section className="wizard-step"><div className="wizard-step-header"><h2>Product information</h2><p>Customer-facing product facts and Merchant listing data.</p></div><div className="wizard-grid"><input required name="name" placeholder="Product name" value={form.name} onChange={change} /><select required name="category" value={form.category} onChange={change}><option value="">Select category</option>{PRODUCT_CATEGORY_OPTIONS.map((category) => <option key={category}>{category}</option>)}</select><input name="brand" placeholder="Brand" value={form.brand} onChange={change} /><input name="vendor" placeholder="Vendor / partner" value={form.vendor} onChange={change} /></div><textarea required name="shortDescription" placeholder="Short description" value={form.shortDescription} onChange={change} /><textarea required name="fullDescription" placeholder="Full description" value={form.fullDescription} onChange={change} /></section><section className="wizard-step"><div className="wizard-step-header"><h2>Price & availability</h2></div><div className="wizard-grid"><input required type="number" min="0" name="price" placeholder="Regular price" value={form.price} onChange={change} /><input type="number" min="0" name="salePrice" placeholder="Sale price (optional)" value={form.salePrice} onChange={change} /><select name="currency" value={form.currency} onChange={change}><option value="NGN">NGN</option><option value="USD">USD</option><option value="GBP">GBP</option></select><input required type="number" min="0" name="stock" placeholder="Stock quantity" value={form.stock} onChange={change} /></div><label className="wizard-checkbox"><input type="checkbox" name="featured" checked={form.featured} onChange={change} /><span>Show as a featured product</span></label></section><section className="wizard-step"><div className="wizard-step-header"><h2>Product care & compliance</h2></div><div className="wizard-grid"><input name="netContent" placeholder="Net content, e.g. 100 g" value={form.netContent} onChange={change} /><input name="countryOfOrigin" placeholder="Country of origin" value={form.countryOfOrigin} onChange={change} /><input name="gtin" placeholder="GTIN / barcode (if supplied)" value={form.gtin} onChange={change} /><input name="googleProductCategory" placeholder="Google product category" value={form.googleProductCategory} onChange={change} /></div><textarea name="ingredients" placeholder="Ingredients / product contents" value={form.ingredients} onChange={change} /><textarea name="directions" placeholder="Directions for use" value={form.directions} onChange={change} /><textarea name="warnings" placeholder="Warnings and safety information" value={form.warnings} onChange={change} /></section><section className="wizard-step"><div className="wizard-step-header"><h2>Images & international shipping</h2></div><div className="wizard-grid"><input type="number" min="0" step="0.01" name="shippingWeight" placeholder="Packed weight (kg)" value={form.shippingWeight} onChange={change} /><input name="shippingClass" placeholder="Shipping class" value={form.shippingClass} onChange={change} /></div><label className="wizard-checkbox"><input type="checkbox" name="shipsInternationally" checked={form.shipsInternationally} onChange={change} /><span>This product can ship internationally</span></label><div className="upload-box"><p>Main product image</p><input type="file" accept="image/*" onChange={(e) => setForm((current) => ({ ...current, coverImage: e.target.files?.[0] || null }))} /></div><div className="upload-box"><p>Additional images</p><input type="file" multiple accept="image/*" onChange={(e) => setForm((current) => ({ ...current, gallery: Array.from(e.target.files || []) }))} /></div></section>{message && <p className="upload-status">{message}</p>}<div className="wizard-actions"><button className="wizard-primary-btn" disabled={isUploading}>{isUploading ? "Saving…" : editingProduct ? "Update product" : "Publish product"}</button>{editingProduct && <button type="button" className="wizard-danger-btn" onClick={onCancelEdit}>Cancel</button>}</div></form></div>;
}
