import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Sprout, Users, BriefcaseBusiness, ArrowRight, Handshake, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import ServicePromoCarousel from "../components/ServicePromoCarousel";
import PostShareButton from "../components/PostShareButton";
import { getProducts, getTestimonials } from "../services/api";
import useScrollReveal from "../hooks/useScrollReveal";
import { getVideoEmbedUrl } from "../utils/videoEmbed";

const pillars = [
  { icon: Sprout, title: "Naturopathic Wellness", text: "Natural solutions for a healthier, longer, and vibrant life." },
  { icon: BriefcaseBusiness, title: "Wellness Education", text: "Free practical learning on wellness, hygiene, and responsible product use." },
  { icon: Users, title: "Naturopathic Equipment", text: "High-quality wellness equipment for home use and professional care." },
  { icon: ArrowRight, title: "Community Outreach", text: "Learn, serve, and create meaningful community impact." },
];

const trainings = ["Wellness and hygiene education", "Responsible product use according to label directions", "Leadership and public speaking", "Community outreach and customer relationships"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [typedText, setTypedText] = useState("");
  useScrollReveal();

  useEffect(() => {
    const phrases = [
      "Wellness education. Community. Support.",
      "Natural health for a vibrant life.",
      "Learn together. Serve your community.",
    ];
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const timer = window.setInterval(() => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      setTypedText(phrase.slice(0, characterIndex));

      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }, 85);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    getProducts().then((data) => setProducts(Array.isArray(data) ? data.filter((p) => p.featured).slice(0, 4) : [])).catch(() => setProducts([]));
    getTestimonials(true).then((data) => setTestimonials(Array.isArray(data) ? data.map((item) => ({ ...item, videoFile: item.videoFile || item.video || "", audioFile: item.audioFile || item.audio || "" })).slice(0, 3) : [])).catch(() => setTestimonials([]));
  }, []);

  return (
    <>
      <Navbar />
      <main className="easy-life-home">
        <section className="easy-hero reveal active">
          <div className="container easy-hero-grid reveal">
            <div className="easy-hero-content">
              <p className="easy-eyebrow">EASY LIFE <span>WELLNESS HUB</span></p>
              <h1>Empowering People.<br /><em>Transforming Lives.</em></h1>
              <p className="easy-hero-tagline">{typedText}<span className="typing-caret" aria-hidden="true">|</span></p>
              <p className="easy-purpose-label">What Easy Life Wellness Hub does</p>
              <p className="easy-hero-copy">Easy Life Wellness Hub offers wellness products, free practical education, and community support for healthier everyday living.</p>
              <div className="easy-actions">
                <Link className="easy-btn easy-btn-primary" to="/collection">Shop Wellness Products <ArrowRight size={18} /></Link>
                <Link className="easy-btn easy-btn-light" to="/register">Join the Community</Link>
              </div>
              <div className="easy-payment-promise">
                <Truck size={22} aria-hidden="true" />
                <div><strong>Pay on Delivery Available</strong><span>Order online and pay when your items arrive.</span></div>
              </div>
            </div>
            <aside className="easy-hero-card hover-lift">
              <span>GOOD HEALTH</span>
              <strong>Good Health.<br />Knowledge.<br />Community.</strong>
              <p>Be part of a global movement.<br />★★★★★<br /><b>Your future starts here!</b></p>
            </aside>
          </div>
        </section>

        <div className="easy-marquee" aria-label="Easy Life principles">
          <div className="easy-marquee-track">
            <span>REAL PRODUCTS</span><i>•</i><span>REAL RESULTS</span><i>•</i><span>REAL PEOPLE</span><i>•</i><span>REAL OPPORTUNITY</span><i>•</i><span>REAL IMPACT</span><i>•</i><span>REAL FREEDOM</span><i>•</i>
            <span>REAL PRODUCTS</span><i>•</i><span>REAL RESULTS</span><i>•</i><span>REAL PEOPLE</span><i>•</i><span>REAL OPPORTUNITY</span><i>•</i><span>REAL IMPACT</span><i>•</i><span>REAL FREEDOM</span>
          </div>
        </div>

        <ServicePromoCarousel />

        <section className="easy-intro section reveal">
          <div className="container easy-intro-grid">
            <p className="easy-eyebrow">WELCOME TO EASY LIFE</p>
            <div><h2>A better life starts with the right support.</h2><p>We are an independent wellness, entrepreneurship and leadership development organization. We equip people with knowledge, quality products, practical skills and a community that helps them move forward.</p><img className="easy-inline-image hover-lift" src="/image-1.png" alt="Easy Life wellness training session" /></div>
          </div>
        </section>

        <section className="section easy-pillars reveal">
          <div className="container"><div className="easy-section-heading"><p className="easy-eyebrow">OUR CORE AREAS</p><h2>Learn, live well, and serve your community.</h2></div><div className="easy-pillar-grid">{pillars.map(({ icon: Icon, title, text }) => <article key={title} className="easy-pillar content-card"><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="section easy-products reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">NATUROPATHIC WELLNESS</p><h2>Natural solutions for a healthier, longer, vibrant life.</h2><p className="easy-products-intro">These featured products and more, are available to purchase from Easy Life Wellness Hub. Open any product to view its description, price, availability, and ordering options.</p></div><Link to="/collection" className="easy-text-link">Explore products <ArrowRight size={17} /></Link></div>{products.length ? <ProductGrid products={products} /> : <div className="easy-empty"><Sprout size={30} /><p>Our wellness product collection is being prepared. Please check back soon.</p></div>}</div></section>

        <section className="section easy-training-section reveal"><div className="container easy-two-column"><div><p className="easy-eyebrow">FREE WEEKLY TRAINING</p><h2>Learn practical wellness, hygiene, and community skills.</h2><p>Registered members can attend free training every Thursday at 11:00 AM at our Akpakpava location. Sessions cover wellness and hygiene education, responsible product use according to label directions, leadership, and community outreach.</p><Link to="/register" className="easy-btn easy-btn-primary breathing-button">Join the community <ArrowRight size={18} /></Link><ul className="easy-training-list">{trainings.map((item) => <li key={item}>✓ {item}</li>)}</ul></div><img className="easy-section-image" src="/image-5.png" alt="Easy Life wellness education and community training" /></div></section>

        {testimonials.length > 0 && <section className="section testimonials-showcase reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">COMMUNITY STORIES</p><h2>See how the Easy Life community is growing.</h2></div><Link className="easy-text-link" to="/testimonials">View all stories <ArrowRight size={17} /></Link></div><div className="testimonial-home-grid">{testimonials.map((item) => { const embedUrl = getVideoEmbedUrl(item.videoUrl); return <article className="testimonial-home-card content-card" key={item._id}>{(item.videoFile || item.audioFile || embedUrl || item.image) && <div className="testimonial-home-media">{item.videoFile ? <video controls preload="metadata" poster={item.image || undefined} src={item.videoFile} /> : item.audioFile ? <audio controls preload="metadata" src={item.audioFile} /> : embedUrl ? <iframe title={`${item.name} testimonial video`} src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <img src={item.image} alt={item.name} />}</div>}<div><p>“{item.testimony}”</p><strong>{item.name}</strong>{item.role && <span>{item.role}</span>}<PostShareButton title={item.title || item.name} text={item.testimony} url={`${window.location.origin}/testimonials#${item._id}`} /></div></article>; })}</div></div></section>}

        <section className="easy-membership"><div className="container easy-membership-grid"><div><p className="easy-eyebrow">MEMBERSHIP</p><h2>Learn freely. Participate fully.</h2><p>Registered members receive free Thursday training at 11:00 AM in Akpakpava, wellness education, leadership development, and opportunities to join official health-awareness outreaches.</p></div><div className="easy-member-card content-card"><strong>Registered members can</strong><ul><li>Attend free weekly wellness and hygiene training</li><li>Learn responsible product use according to label directions</li><li>Follow Easy Life to official health-awareness outreaches</li><li>Build confidence, leadership, and community connections</li></ul><Link to="/register" className="easy-btn easy-btn-light breathing-button">Become a member</Link></div></div></section>

        <section className="section easy-outreach reveal"><div className="container easy-three-column"><img className="easy-section-image" src="/image-7.png" alt="Easy Life community outreach and partnership activity" /><div><p className="easy-eyebrow">OUTREACH & PARTNERSHIPS</p><h2>Growing healthier, stronger communities together.</h2><p>We welcome wellness companies, schools, churches, NGOs, corporate organizations and community associations that want to sponsor learning, showcase products or create meaningful local impact.</p><Link to="/contact" className="easy-text-link">Discuss a partnership <Handshake size={18} /></Link></div><div className="easy-outreach-mark content-card"><HeartPulse size={48} /><span>COMMUNITY<br />IMPACT</span></div></div></section>

        <section className="easy-closing reveal"><div className="container"><p className="easy-eyebrow">WELLNESS STARTS WITH KNOWLEDGE</p><h2>We help you learn and live well.</h2><p className="easy-closing-copy">Live the Easy Life.<br />Healthy body. Strong mind. Supportive community.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary breathing-button" to="/register">Join the community</Link><Link className="easy-btn easy-btn-light breathing-button" to="/contact">Contact Easy Life</Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
