import { useEffect, useState } from "react";
import { createTestimonialApi, deleteTestimonialApi, getAdminTestimonials, getContentUploadUrl, updateTestimonialApi } from "../services/api";
import { getToken } from "../utils/auth";
import useAuth from "../context/AuthContext";

const MAX_MEDIA_SIZE_MB = 500;
const MAX_MEDIA_SIZE_BYTES = MAX_MEDIA_SIZE_MB * 1024 * 1024;
const blank = { contentType: "story", title: "", name: "", role: "", testimony: "", linkUrl: "", videoUrl: "", featured: false, bannerEnabled: false, approved: true, status: "active", seoTitle: "", seoDescription: "", image: null, video: null, audio: null };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [mediaType, setMediaType] = useState("text");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const { isSubadmin } = useAuth();

  async function load() { setItems(await getAdminTestimonials(getToken())); }
  useEffect(() => { load().catch(() => setMessage("Unable to load content.")); }, []);

  function change(event) {
    const { name, value, checked, type, files } = event.target;
    if (type === "file") {
      const file = files?.[0];
      if (file && file.size > MAX_MEDIA_SIZE_BYTES) {
        setMessage(`Please choose a file smaller than ${MAX_MEDIA_SIZE_MB} MB.`);
        event.target.value = "";
        return;
      }
      setForm((current) => ({ ...current, image: null, video: null, audio: null, [mediaType]: file || null }));
      return;
    }
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value, ...(name === "contentType" && value === "homepage-media" ? { featured: true } : {}) }));
  }

  function changeMediaType(event) {
    setMediaType(event.target.value);
    setForm((current) => ({ ...current, image: null, video: null, audio: null }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !["image", "video", "audio"].includes(key)) data.append(key, value);
    });
    try {
      const file = form[mediaType];
      if (file) {
        setMessage("Uploading media directly to storage…");
        const { uploadUrl, publicUrl } = await getContentUploadUrl(file, mediaType, getToken());
        const upload = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        if (!upload.ok) throw new Error("Media upload to storage failed.");
        data.append(mediaType === "image" ? "image" : `${mediaType}File`, publicUrl);
      }
      if (editing) await updateTestimonialApi(editing, data, getToken());
      else await createTestimonialApi(data, getToken());
      setForm(blank);
      setMediaType("text");
      setEditing(null);
      setMessage("Content saved.");
      await load();
    } catch (error) { setMessage(error.message || "Unable to save content."); }
  }

  function edit(item) {
    setEditing(item._id);
    setMediaType(item.videoFile ? "video" : item.audioFile ? "audio" : item.image ? "image" : "text");
    setForm({ ...blank, ...item });
  }

  async function remove(id) { if (!window.confirm("Delete this content post?")) return; await deleteTestimonialApi(id, getToken()); await load(); }

  return <div className="page admin-testimonials"><div className="page-header"><div><span className="eyebrow">EASY LIFE CONTENT</span><h1>Content Studio</h1><p>{isSubadmin ? "Submit announcements, stories, outreach, journeys, or promotional media for admin review." : "Publish announcements, stories, outreach, journeys, or promotional media."}</p></div></div><form className="testimonial-admin-form" onSubmit={submit}><select required name="contentType" value={form.contentType} onChange={change}><option value="announcement">Announcement</option><option value="story">Story</option><option value="outreach">Outreach activity</option><option value="journey">Journey</option><option value="testimony">Testimony</option><option value="homepage-media">Homepage promotional media</option></select><input name="title" placeholder="Post title" value={form.title} onChange={change} /><input required name="name" placeholder="Name or organisation" value={form.name} onChange={change} /><input name="role" placeholder="Role or location (optional)" value={form.role} onChange={change} /><textarea required name="testimony" placeholder="Post content or media description" rows="5" value={form.testimony} onChange={change} /><label>Media type<select value={mediaType} onChange={changeMediaType}><option value="text">Text</option><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option></select></label>{mediaType !== "text" && <label>{mediaType[0].toUpperCase() + mediaType.slice(1)} upload (maximum {MAX_MEDIA_SIZE_MB} MB)<input key={mediaType} type="file" name={mediaType} accept={`${mediaType}/*`} onChange={change} /></label>}{mediaType === "video" && <input name="videoUrl" placeholder="External YouTube/Vimeo URL (optional)" value={form.videoUrl} onChange={change} />}<input name="linkUrl" placeholder="Post link (optional)" value={form.linkUrl} onChange={change} /><input name="seoTitle" placeholder="SEO title" value={form.seoTitle} onChange={change} /><textarea name="seoDescription" placeholder="SEO description" rows="3" value={form.seoDescription} onChange={change} />{!isSubadmin && <><label className="wizard-checkbox"><input type="checkbox" name="featured" checked={form.featured} onChange={change} /> Feature on Home</label><label className="wizard-checkbox"><input type="checkbox" name="bannerEnabled" checked={form.bannerEnabled} onChange={change} /> Show as sitewide announcement (maximum 3)</label><label className="wizard-checkbox"><input type="checkbox" name="approved" checked={form.approved} onChange={change} /> Approved and visible</label></>}<button className="primary">{editing ? "Update content" : isSubadmin ? "Submit for admin review" : "Publish content"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(blank); setMediaType("text"); }}>Cancel edit</button>}{message && <p>{message}</p>}</form><div className="admin-testimonial-list">{items.map((item) => <article className="testimonial-admin-item content-card" key={item._id}><div><strong>{item.title || item.contentType}</strong><span>{item.name} · {item.contentType}</span><p>{item.testimony}</p><small>{item.featured ? "Featured on Home" : "Content Studio only"} · {item.bannerEnabled ? "Banner" : "No banner"} · {item.approved ? "Visible" : "Awaiting review"}</small></div><div><button type="button" onClick={() => edit(item)}>Edit</button><button type="button" className="btn-danger" onClick={() => remove(item._id)}>Delete</button></div></article>)}</div></div>;
}
