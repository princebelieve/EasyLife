import { useEffect, useState } from "react";
import { createTestimonialApi, deleteTestimonialApi, getAdminTestimonials, updateTestimonialApi } from "../services/api";
import { getToken } from "../utils/auth";

const blank = { name: "", role: "", testimony: "", videoUrl: "", featured: false, approved: true, status: "active", seoTitle: "", seoDescription: "", image: null, video: null };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  async function load() { setItems(await getAdminTestimonials(getToken())); }
  useEffect(() => { load().catch(() => setMessage("Unable to load testimonials.")); }, []);
  function change(event) { const { name, value, checked, files, type } = event.target; setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : files ? files[0] : value })); }
  async function submit(event) { event.preventDefault(); setMessage(""); const data = new FormData(); Object.entries(form).forEach(([key, value]) => { if (value !== null && value !== undefined && !["image", "video"].includes(key)) data.append(key, value); }); if (form.image) data.append("image", form.image); if (form.video) data.append("video", form.video); try { if (editing) await updateTestimonialApi(editing, data, getToken()); else await createTestimonialApi(data, getToken()); setForm(blank); setEditing(null); setMessage("Testimonial saved."); await load(); } catch (error) { setMessage(error.message || "Unable to save testimonial."); } }
  function edit(item) { setEditing(item._id); setForm({ ...blank, ...item, image: null, video: null }); }
  async function remove(id) { if (!window.confirm("Delete this testimonial?")) return; await deleteTestimonialApi(id, getToken()); await load(); }

  return <div className="page admin-testimonials"><div className="page-header"><div><span className="eyebrow">EASY LIFE CONTENT</span><h1>Testimonials & Videos</h1><p>Publish approved stories with names, testimony text, images, videos, and SEO metadata.</p></div></div><form className="testimonial-admin-form" onSubmit={submit}><input required name="name" placeholder="Name" value={form.name} onChange={change} /><input name="role" placeholder="Role or location (optional)" value={form.role} onChange={change} /><textarea required name="testimony" placeholder="Testimony" rows="5" value={form.testimony} onChange={change} /><input name="videoUrl" placeholder="YouTube/Vimeo video URL (optional)" value={form.videoUrl} onChange={change} /><label>Image<input type="file" name="image" accept="image/*" onChange={change} /></label><label>Video file (optional, max 100 MB)<input type="file" name="video" accept="video/*" onChange={change} /></label><input name="seoTitle" placeholder="SEO title" value={form.seoTitle} onChange={change} /><textarea name="seoDescription" placeholder="SEO description" rows="3" value={form.seoDescription} onChange={change} /><label className="wizard-checkbox"><input type="checkbox" name="featured" checked={form.featured} onChange={change} /> Feature on Home</label><label className="wizard-checkbox"><input type="checkbox" name="approved" checked={form.approved} onChange={change} /> Approved and visible</label><button className="primary">{editing ? "Update testimonial" : "Publish testimonial"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(blank); }}>Cancel edit</button>}{message && <p>{message}</p>}</form><div className="admin-testimonial-list">{items.map((item) => <article className="testimonial-admin-item content-card" key={item._id}><div><strong>{item.name}</strong><span>{item.role}</span><p>{item.testimony}</p><small>{item.featured ? "Featured" : "Not featured"} · {item.approved ? "Visible" : "Hidden"}</small></div><div><button onClick={() => edit(item)}>Edit</button><button className="btn-danger" onClick={() => remove(item._id)}>Delete</button></div></article>)}</div></div>;
}
