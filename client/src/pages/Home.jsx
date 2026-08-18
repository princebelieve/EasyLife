import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Sprout, Users, BriefcaseBusiness, ArrowRight, Handshake } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/api";
import useScrollReveal from "../hooks/useScrollReveal";

const pillars = [
  { icon: Sprout, title: "Wellness & Natural Living", text: "Practical wellness education and thoughtfully selected natural wellness products." },
  { icon: BriefcaseBusiness, title: "Business & Leadership", text: "Entrepreneurship, ethical network marketing, sales, branding and leadership development." },
  { icon: Users, title: "Mentorship & Community", text: "A supportive place to learn, network, build confidence and grow with others." },
  { icon: HeartPulse, title: "Outreach & Impact", text: "Health awareness, community engagement and opportunities to serve." },
];

const trainings = ["Network marketing", "Sales & customer relationships", "Leadership & public speaking", "Personal branding & financial literacy"];

export default function Home() {
  const [products, setProducts] = useState([]);
  useScrollReveal();

  useEffect(() => {
    getProducts().then((data) => setProducts(Array.isArray(data) ? data.filter((p) => p.featured).slice(0, 4) : [])).catch(() => setProducts([]));
  }, []);

  return (
    <>
      <Navbar />
      <main className="easy-life-home">
        <section className="easy-hero">
          <div className="container easy-hero-grid reveal">
            <div className="easy-hero-content">
              <p className="easy-eyebrow">WELLNESS • KNOWLEDGE • OPPORTUNITY</p>
              <h1>Empowering People.<br /><em>Transforming Lives.</em></h1>
              <p className="easy-hero-copy">Easy Life Wellness Hub brings together wellness products, practical education, business opportunity, leadership development and community impact.</p>
              <div className="easy-actions">
                <Link className="easy-btn easy-btn-primary" to="/collection">Shop Wellness Products <ArrowRight size={18} /></Link>
                <Link className="easy-btn easy-btn-light" to="/register">Join the Community</Link>
              </div>
            </div>
            <aside className="easy-hero-card hover-lift">
              <span>THE EASY LIFE</span>
              <strong>Good Health.<br />Wealth.<br />Freedom.</strong>
              <p>Healthy body. Strong mind. Positive impact.</p>
            </aside>
          </div>
        </section>

        <section className="easy-intro section reveal">
          <div className="container easy-intro-grid">
            <p className="easy-eyebrow">WELCOME TO EASY LIFE</p>
            <div><h2>A better life starts with the right support.</h2><p>We are an independent wellness, entrepreneurship and leadership development organization. We equip people with knowledge, quality products, practical skills and a community that helps them move forward.</p><img className="easy-inline-image hover-lift" src="/image-1.png" alt="Easy Life wellness training session" /></div>
          </div>
        </section>

        <section className="section easy-pillars reveal">
          <div className="container"><div className="easy-section-heading"><p className="easy-eyebrow">WHAT WE DO</p><h2>Four paths to a stronger future</h2></div><div className="easy-pillar-grid">{pillars.map(({ icon: Icon, title, text }) => <article key={title} className="easy-pillar hover-lift"><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="section easy-products"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">WELLNESS SHOP</p><h2>Products for your wellness journey</h2></div><Link to="/collection" className="easy-text-link">Shop all products <ArrowRight size={17} /></Link></div>{products.length ? <ProductGrid products={products} /> : <div className="easy-empty"><Sprout size={30} /><p>Our wellness product collection is being prepared. Please check back soon.</p></div>}</div></section>

        <section className="section easy-services"><div className="container easy-two-column"><div><p className="easy-eyebrow">WELLNESS SERVICES</p><h2>Guidance for healthier everyday choices.</h2><p>Explore available wellness education, product guidance and wellness-service appointments with an Easy Life representative.</p><Link to="/contact" className="easy-btn easy-btn-primary">Make an enquiry <ArrowRight size={18} /></Link></div><div className="easy-service-list"><div><strong>Natural wellness products</strong><span>Clear product information, directions and care guidance.</span></div><div><strong>Wellness sessions</strong><span>Ask about available check-up and foot-bath wellness services.</span></div><div><strong>Education first</strong><span>Learn practical habits that support healthy living.</span></div></div></div></section>

        <section className="section"><div className="container easy-training"><div><p className="easy-eyebrow">LEARN • GROW • LEAD</p><h2>Build skills that serve you for life and business.</h2><p>Everyone is welcome at introductory training. Registered members receive more opportunities to learn, contribute and grow.</p><Link to="/register" className="easy-btn easy-btn-primary">Register your interest <ArrowRight size={18} /></Link></div><ul>{trainings.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></section>

        <section className="easy-membership"><div className="container easy-membership-grid"><div><p className="easy-eyebrow">MEMBERSHIP</p><h2>Learn freely. Participate fully.</h2><p>Introductory training is open to everyone. Registered members receive mentorship, leadership development, networking opportunities, priority outreach participation and selected-program discounts.</p></div><div className="easy-member-card"><strong>Registered members can</strong><ul><li>Access exclusive training sessions</li><li>Request business mentorship</li><li>Represent Easy Life at official outreach activities</li><li>Build their network and confidence</li></ul><Link to="/register" className="easy-btn easy-btn-light">Become a member</Link></div></div></section>

        <section className="section easy-outreach"><div className="container easy-two-column"><div className="easy-outreach-mark"><HeartPulse size={48} /><span>COMMUNITY<br />IMPACT</span></div><div><p className="easy-eyebrow">OUTREACH & PARTNERSHIPS</p><h2>Growing healthier, stronger communities together.</h2><p>We welcome wellness companies, schools, churches, NGOs, corporate organizations and community associations that want to sponsor learning, showcase products or create meaningful local impact.</p><Link to="/contact" className="easy-text-link">Discuss a partnership <Handshake size={18} /></Link></div></div></section>

        <section className="easy-closing"><div className="container"><p className="easy-eyebrow">YOUR SUCCESS BEGINS HERE</p><h2>We Learn, We Connect, We Grow</h2><div className="easy-actions"><Link className="easy-btn easy-btn-primary" to="/collection">Shop now</Link><Link className="easy-btn easy-btn-light" to="/contact">Contact Easy Life</Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
