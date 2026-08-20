import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { getTestimonials } from "../services/api";

export default function SiteAnnouncementBanner() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getTestimonials(false).then((data) => setItems(Array.isArray(data) ? data.filter((item) => item.bannerEnabled).slice(0, 3) : [])).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 4500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length || dismissed) return null;
  const item = items[index];
  const target = item.linkUrl || "/testimonials";
  const isExternal = /^https?:\/\//i.test(target);

  return <div className="site-announcement-banner" role="status"><span className="site-announcement-label">{item.contentType || "announcement"}</span><span className="site-announcement-text">{item.title || item.testimony}</span>{isExternal ? <a href={target} target="_blank" rel="noreferrer">View post <ArrowRight size={14} /></a> : <Link to={target}>View post <ArrowRight size={14} /></Link>}<button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss announcement"><X size={15} /></button></div>;
}
