import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { getTestimonials } from "../services/api";
import useAuth from "../context/AuthContext";
import { getSafeContentLink } from "../utils/contentLinks";
import relativeDateTime from "../utils/relativeDateTime";

export default function SiteAnnouncementBanner() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    getTestimonials(false).then((data) => setItems(Array.isArray(data) ? data.filter((item) => item.bannerEnabled).slice(0, 3) : [])).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!items.length) return undefined;
    const timer = window.setTimeout(() => setVisible(true), 5000);
    return () => window.clearTimeout(timer);
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 6500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length || dismissed || !visible) return null;
  const item = items[index];
  const target = getSafeContentLink(item.linkUrl, `/testimonials#${item._id}`);
  const isExternal = /^https?:\/\//i.test(target);
  function viewPost(event) {
    setDismissed(true);
    if (isLoggedIn) return;
    event.preventDefault();
    sessionStorage.setItem("pendingAnnouncementUrl", target);
    navigate("/login");
  }

  function dismiss() {
    setDismissed(true);
  }

  const announcementLink = isExternal ? (
    <a href={target} target="_blank" rel="noreferrer" onClick={viewPost}>
      Read more <ArrowRight size={16} aria-hidden="true" />
    </a>
  ) : (
    <Link to={target} onClick={viewPost}>
      Read more <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );

  return (
    <div className="site-announcement-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <section className="site-announcement-popup" role="dialog" aria-modal="true" aria-labelledby="site-announcement-title">
      <button type="button" className="site-announcement-close" onClick={dismiss} aria-label="Dismiss announcement">
        <X size={18} aria-hidden="true" />
      </button>
      {item.mediaType === "image" && item.image && <img className="site-announcement-media" src={item.image} alt={item.title || item.name || "Announcement"} />}
      {item.mediaType === "video" && item.videoFile && <video className="site-announcement-media" controls playsInline preload="metadata" poster={item.image || undefined} src={item.videoFile} />}
      {item.mediaType === "audio" && item.audioFile && <div className="site-announcement-audio"><audio controls preload="metadata" src={item.audioFile} /></div>}
      <div className="site-announcement-copy">
        <span className="site-announcement-label">{item.contentType || "Announcement"}</span>
        <h2 id="site-announcement-title">{item.title || item.name || "EASYLIFE announcement"}</h2>
        {item.testimony && <p>{item.testimony}</p>}
        {item.createdAt && <small>Uploaded {relativeDateTime(item.createdAt)}</small>}
        {item.updatedAt && item.updatedAt !== item.createdAt && <small>Updated {relativeDateTime(item.updatedAt)}</small>}
        {announcementLink}
      </div>
      </section>
    </div>
  );
}
