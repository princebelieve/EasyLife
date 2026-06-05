// client/src/pages/Contact.jsx
import { Mail as LucideMail, Phone, MapPin, Clock } from "lucide-react";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { SiGmail, SiX } from "react-icons/si";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";
import FurnitureInquiryForm from "../components/FurnitureInquiryForm";

export default function Contact() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      <div className="contact-page">
        <section className="contact-hero reveal">
          <div className="container contact-hero-card">
            <div className="contact-copy">
              <span className="eyebrow">CONTACT NEWBREND FURNITURE</span>

              <h1>Get In Touch For Your Perfect Interior</h1>

              <p>
                Ready to transform your space? Contact us for custom furniture
                design, interior consultations, or to discuss your next
                furniture project.
              </p>

              <div className="contact-strip">
                <a
                  href="https://wa.me/2348037757718"
                  target="_blank"
                  rel="noreferrer"
                  className="strip-card whatsapp-card"
                >
                  <FaWhatsapp size={28} />
                  <div>
                    <strong>Chat on WhatsApp</strong>
                    <span>Fastest response and order support</span>
                  </div>
                </a>

                <a
                  href="newbrend001@gmail.com"
                  className="strip-card email-card"
                >
                  <SiGmail size={28} />
                  <div>
                    <strong>Email Us</strong>
                    <span>mailto:newbrend001@gmail.com</span>
                  </div>
                </a>
              </div>

              <div className="social-links">
                <a
                  href="https://x.com/NewtonMM"
                  target="_blank"
                  rel="noreferrer"
                  className="social-x"
                  aria-label="X"
                >
                  <SiX size={24} />
                </a>

                <a
                  href="https://www.instagram.com/newbrend101?igsh=MWpuN2tlbG41cG5r"
                  target="_blank"
                  rel="noreferrer"
                  className="social-instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>

                <a
                  href="https://www.tiktok.com/@centnewton2?_r=1&_t=ZN-96wE1C2UMBb"
                  target="_blank"
                  rel="noreferrer"
                  className="social-tiktok"
                  aria-label="TikTok"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="container reveal">
          <div className="dual-grid">
            <div className="contact-info-panel hover-lift">
              <h2>Contact Information</h2>

              <div className="info-list">
                <div>
                  <MapPin size={20} />
                  <span>
                    Km 15, Abraka-Agbor Road, Abraka, Delta State, Nigeria
                  </span>
                </div>

                <div>
                  <Phone size={20} />
                  <span>+2348037757718</span>
                </div>

                <div>
                  <LucideMail size={20} />
                  <span>mailto:newbrend001@gmail.com</span>
                </div>

                <div>
                  <Clock size={20} />
                  <span>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</span>
                </div>
              </div>

              <p>
                Whether you're looking for ready-to-ship furniture or bespoke
                custom pieces, our team is here to help bring your interior
                vision to life.
              </p>
            </div>

            <div className="contact-info-panel hover-lift">
              <h2>Start Your Project</h2>

              <div className="info-list">
                <div>
                  <span>📐</span>
                  <span>Room measurements & space planning</span>
                </div>

                <div>
                  <span>🎨</span>
                  <span>Custom design consultations</span>
                </div>

                <div>
                  <span>🛋️</span>
                  <span>Furniture selection & styling</span>
                </div>

                <div>
                  <span>🚚</span>
                  <span>Delivery & installation services</span>
                </div>
              </div>

              <p>
                Every project starts with understanding your needs. Share your
                ideas and let's create something beautiful together.
              </p>
            </div>
          </div>
        </section>

        <section className="container reveal measurement-layout">
          <FurnitureInquiryForm />

          <div className="contact-info-panel hover-lift">
            <h2>Why Choose NewBrend Furniture?</h2>

            <div className="info-list">
              <div>
                <span>⭐</span>
                <span>Premium quality materials & craftsmanship</span>
              </div>

              <div>
                <span>🎯</span>
                <span>Custom designs tailored to your space</span>
              </div>

              <div>
                <span>⚡</span>
                <span>Fast production and reliable delivery</span>
              </div>

              <div>
                <span>💬</span>
                <span>Personal consultation and support</span>
              </div>
            </div>

            <p>
              Every inquiry is reviewed personally, and we will contact you
              within 24 hours to discuss your project details, timeline, and
              next steps.
            </p>
          </div>
        </section>

        <section className="section reveal">
          <div className="container">
            <div className="values-header">
              <span className="eyebrow">HOW WE WORK</span>
              <h2 className="title">From Concept to Completion</h2>
            </div>

            <div className="service-grid">
              <div className="service-card hover-lift">
                <h3>1. Consultation</h3>
                <p>
                  We discuss your vision, budget, and timeline to understand
                  your unique requirements.
                </p>
              </div>

              <div className="service-card hover-lift">
                <h3>2. Design & Planning</h3>
                <p>
                  Our designers create detailed plans, material selections, and
                  3D visualizations for your approval.
                </p>
              </div>

              <div className="service-card hover-lift">
                <h3>3. Manufacturing</h3>
                <p>
                  Premium materials are carefully crafted in our workshops with
                  attention to every detail.
                </p>
              </div>

              <div className="service-card hover-lift">
                <h3>4. Delivery & Setup</h3>
                <p>
                  Professional delivery and installation ensures your new
                  furniture fits perfectly in your space.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
