import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getTestimonials } from "../services/api";
import { setMetaTags } from "../utils/metaTags";
import useScrollReveal from "../hooks/useScrollReveal";

function getVideoEmbedUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).pop()}`;
  } catch {
    return "";
  }
  return "";
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  useScrollReveal();

  useEffect(() => {
    setMetaTags({
      title: "Easy Life Testimonials | Real Wellness Journeys",
      description: "Hear real Easy Life Wellness Hub stories, wellness journeys, and community experiences through video and written testimonials.",
      url: `${window.location.origin}/testimonials`,
    });
    getTestimonials().then((data) => setTestimonials(Array.isArray(data) ? data : [])).catch(() => setTestimonials([]));
  }, []);

  return <><Navbar /><main className="testimonials-page"><section className="testimonials-hero reveal"><div className="container"><span className="eyebrow">REAL PEOPLE. REAL RESULTS.</span><h1>Stories from the Easy Life community.</h1><p>Explore wellness journeys, personal growth, and community experiences shared by people connected to Easy Life Wellness Hub.</p></div></section><section className="section"><div className="container"><div className="testimonials-grid">{testimonials.map((item) => { const embedUrl = getVideoEmbedUrl(item.videoUrl); return <article className="testimonial-card content-card" key={item._id}>{(item.videoFile || embedUrl || item.image) && <div className="testimonial-media">{item.videoFile ? <video controls preload="metadata" poster={item.image || undefined} src={item.videoFile} /> : embedUrl ? <iframe title={`${item.name} testimonial video`} src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <img src={item.image} alt={item.name} />}</div>}<div className="testimonial-body"><p className="testimonial-quote">“{item.testimony}”</p><h2>{item.name}</h2>{item.role && <span>{item.role}</span>}</div></article>; })}</div>{!testimonials.length && <div className="empty-state"><h2>Stories are being prepared.</h2><p>Check back soon for Easy Life community experiences.</p></div>}</div></section></main><Footer /></>;
}
