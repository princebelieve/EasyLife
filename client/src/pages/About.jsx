//client/src/pages/About.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";

export default function About() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="about-hero reveal">
        <div className="container about-hero-grid">
          <div className="about-copy">
            <span className="eyebrow">ABOUT NEWBREND FURNITURE</span>

            <h1>
              Crafted For Comfort.
              <br />
              Designed For Home.
            </h1>

            <p>
              NewBrend Furniture is a premium furniture and interior brand
              dedicated to creating beautiful, functional living spaces. From
              bespoke sofas and dining tables to custom shelving and interior
              decor, every piece is crafted with luxury materials and attention
              to detail.
            </p>
          </div>

          <div className="about-image-wrap hover-lift">
            <img src="/about.jpeg" alt="NewBrend Furniture interior" />
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section reveal">
        <div className="container about-story">
          <div className="story-card hover-lift">
            <h2 className="title">Our Story</h2>
            <p className="muted">
              NewBrend Furniture was built from a passion for timeless design and
              quality craftsmanship. We believe furniture should do more than
              look beautiful — it should create comfort, elevate your interior,
              and make every home feel exceptional.
            </p>
          </div>

          <div className="story-card hover-lift">
            <h2 className="title">Our Promise</h2>

            <ul className="promise-list">
              <li>Premium material sourcing</li>
              <li>Luxury finishes and refined detailing</li>
              <li>Fast production and reliable delivery</li>
              <li>Designs tailored to your space</li>
              <li>Custom furniture made for your lifestyle</li>
            </ul>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-alt reveal">
        <div className="container">
          <div className="values-header">
            <span className="eyebrow">WHY CLIENTS CHOOSE US</span>
            <h2 className="title">Luxury Interiors With Real Craftsmanship</h2>
          </div>

          <div className="service-grid">
            <div className="service-card hover-lift">
              <h3>Tailored Precision</h3>
              <p>
                Every outfit is measured and crafted to deliver a clean,
                confident and flattering fit.
              </p>
            </div>

            <div className="service-card hover-lift">
              <h3>Premium Materials</h3>
              <p>
                We use quality fabrics and finishing that feel luxurious and
                last longer.
              </p>
            </div>

            <div className="service-card hover-lift">
              <h3>Modern Elegance</h3>
              <p>
                Our designs blend tradition with contemporary interiors for a
                refined home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
