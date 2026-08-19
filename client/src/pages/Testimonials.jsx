import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getTestimonials } from "../services/api";
import { setMetaTags } from "../utils/metaTags";
import useScrollReveal from "../hooks/useScrollReveal";

function videoSource(testimonial) {
  if (testimonial.videoFile) return testimonial.videoFile;
  return testimonial.videoUrl;
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

  return <><Navbar /><main className="testimonials-page"><section className="testimonials-hero reveal"><div className="container"><span className="eyebrow">REAL PEOPLE. REAL RESULTS.</span><h1>Stories from the Easy Life community.</h1><p>Explore wellness journeys, personal growth, and community experiences shared by people connected to Easy Life Wellness Hub.</p></div></section><section className="section"><div className="container"><div className="testimonials-grid">{testimonials.map((item) => { const source = videoSource(item); return <article className="testimonial-card content-card reveal" key={item._id}><div className="testimonial-media">{source ? <video controls preload="metadata" poster={item.image || undefined} src={source} /> : item.image ? <img src={item.image} alt={item.name} /> : <div className="testimonial-placeholder">Easy Life Wellness Hub</div>}</div><div className="testimonial-body"><p className="testimonial-quote">“{item.testimony}”</p><h2>{item.name}</h2>{item.role && <span>{item.role}</span>}</div></article>; })}</div>{!testimonials.length && <div className="empty-state"><h2>Stories are being prepared.</h2><p>Check back soon for Easy Life community experiences.</p></div>}</div></section></main><Footer /></>;
}
