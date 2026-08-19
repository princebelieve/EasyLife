import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Sprout, Users, BriefcaseBusiness, ArrowRight, Handshake } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import ServicePromoCarousel from "../components/ServicePromoCarousel";
import { getProducts, getTestimonials } from "../services/api";
import useScrollReveal from "../hooks/useScrollReveal";

const pillars = [
  { icon: Sprout, title: "Naturopathic Wellness", text: "Natural solutions for a healthier, longer, and vibrant life." },
  { icon: BriefcaseBusiness, title: "Network Marketing", text: "A proven platform to build your team and earn unlimited income." },
  { icon: Users, title: "Naturopathic Equipment", text: "High-quality wellness equipment for home use and professional care." },
  { icon: HeartPulse, title: "Test & Checkup", text: "Accurate wellness testing and checkups for early detection and prevention." },
  { icon: ArrowRight, title: "Live Better Earn Big", text: "Improve lives, create impact, and enjoy financial independence." },
];

const trainings = ["Network marketing", "Sales & customer relationships", "Leadership & public speaking", "Personal branding & financial literacy"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [typedText, setTypedText] = useState("");
  useScrollReveal();

  useEffect(() => {
    const phrases = [
      "Naturopathic health. Wealth. Freedom.",
      "Natural health for a vibrant life.",
      "Build your team. Build your legacy.",
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
    getTestimonials(true).then((data) => setTestimonials(Array.isArray(data) ? data.slice(0, 3) : [])).catch(() => setTestimonials([]));
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
              <p className="easy-hero-copy">Easy Life Wellness Hub is a naturopathic network marketing platform dedicated to natural health, wellness, and financial freedom. We empower people to live healthy, earn income, and build generational wealth.</p>
              <div className="easy-actions">
                <Link className="easy-btn easy-btn-primary" to="/collection">Shop Wellness Products <ArrowRight size={18} /></Link>
                <Link className="easy-btn easy-btn-light" to="/register">Join the Community</Link>
              </div>
            </div>
            <aside className="easy-hero-card hover-lift">
              <span>GOOD HEALTH</span>
              <strong>Good Health.<br />Wealth.<br />Freedom.</strong>
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
          <div className="container"><div className="easy-section-heading"><p className="easy-eyebrow">OUR FIVE CORE AREAS</p><h2>Live better. Earn big. Build your legacy.</h2></div><div className="easy-pillar-grid">{pillars.map(({ icon: Icon, title, text }) => <article key={title} className="easy-pillar content-card"><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="section easy-products reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">NATUROPATHIC WELLNESS</p><h2>Natural solutions for a healthier, longer, vibrant life.</h2></div><Link to="/collection" className="easy-text-link">Explore products <ArrowRight size={17} /></Link></div>{products.length ? <ProductGrid products={products} /> : <div className="easy-empty"><Sprout size={30} /><p>Our wellness product collection is being prepared. Please check back soon.</p></div>}</div></section>

        <section className="section easy-services reveal"><div className="container easy-two-column"><div><p className="easy-eyebrow">TEST & CHECKUP</p><h2>Know more. Prevent earlier. Live stronger.</h2><p>Accurate wellness testing and checkups support early detection and prevention. Explore wellness education, product guidance and available appointments with an Easy Life representative.</p><Link to="/contact" className="easy-btn easy-btn-primary breathing-button">Make an enquiry <ArrowRight size={18} /></Link></div><div><div className="easy-service-list"><div className="content-card"><strong>Naturopathic wellness</strong><span>Natural solutions for a healthier, longer, vibrant life.</span></div><div className="content-card"><strong>Naturopathic equipment</strong><span>High-quality wellness equipment for home use and professional care.</span></div><div className="content-card"><strong>Test & checkup</strong><span>Accurate wellness testing and checkups for early detection and prevention.</span></div></div><img className="easy-section-image" src="/image-3.png" alt="Professional wellness testing and checkup session" /></div></div></section>

        <section className="section easy-training-section reveal"><div className="container easy-two-column"><div><p className="easy-eyebrow">NETWORK MARKETING</p><h2>A proven platform to build your team and earn unlimited income.</h2><p>Live better, earn big, improve lives, create impact, and enjoy financial independence through practical training and ethical opportunity.</p><Link to="/register" className="easy-btn easy-btn-primary breathing-button">Join the movement <ArrowRight size={18} /></Link><ul className="easy-training-list">{trainings.map((item) => <li key={item}>✓ {item}</li>)}</ul></div><img className="easy-section-image" src="/image-5.png" alt="Easy Life leadership and team building training" /></div></section>

        {testimonials.length > 0 && <section className="section testimonials-showcase reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">REAL PEOPLE. REAL RESULTS.</p><h2>See how the Easy Life community is growing.</h2></div><Link className="easy-text-link" to="/testimonials">View all stories <ArrowRight size={17} /></Link></div><div className="testimonial-home-grid">{testimonials.map((item) => <article className="testimonial-home-card content-card" key={item._id}>{(item.videoFile || item.videoUrl) ? <video controls preload="metadata" poster={item.image || undefined} src={item.videoFile || item.videoUrl} /> : item.image && <img src={item.image} alt={item.name} />}<div><p>“{item.testimony}”</p><strong>{item.name}</strong>{item.role && <span>{item.role}</span>}</div></article>)}</div></div></section>}

        <section className="easy-membership"><div className="container easy-membership-grid"><div><p className="easy-eyebrow">MEMBERSHIP</p><h2>Learn freely. Participate fully.</h2><p>Introductory training is open to everyone. Registered members receive mentorship, leadership development, networking opportunities, priority outreach participation and selected-program discounts.</p></div><div className="easy-member-card content-card"><strong>Registered members can</strong><ul><li>Access exclusive training sessions</li><li>Request business mentorship</li><li>Represent Easy Life at official outreach activities</li><li>Build their network and confidence</li></ul><Link to="/register" className="easy-btn easy-btn-light breathing-button">Become a member</Link></div></div></section>

        <section className="section easy-outreach reveal"><div className="container easy-three-column"><img className="easy-section-image" src="/image-7.png" alt="Easy Life community outreach and partnership activity" /><div><p className="easy-eyebrow">OUTREACH & PARTNERSHIPS</p><h2>Growing healthier, stronger communities together.</h2><p>We welcome wellness companies, schools, churches, NGOs, corporate organizations and community associations that want to sponsor learning, showcase products or create meaningful local impact.</p><Link to="/contact" className="easy-text-link">Discuss a partnership <Handshake size={18} /></Link></div><div className="easy-outreach-mark content-card"><HeartPulse size={48} /><span>COMMUNITY<br />IMPACT</span></div></div></section>

        <section className="easy-closing reveal"><div className="container"><p className="easy-eyebrow">HEALTH IS YOUR GREATEST WEALTH</p><h2>We help you build the rest.</h2><p className="easy-closing-copy">Live the Easy Life.<br />Healthy body. Strong mind. Financial freedom.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary breathing-button" to="/register">Join today & build your legacy</Link><Link className="easy-btn easy-btn-light breathing-button" to="/contact">Contact Easy Life</Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
