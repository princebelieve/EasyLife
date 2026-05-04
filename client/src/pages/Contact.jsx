// client/src/pages/Contact.jsx
import { MessageCircle, Mail, Phone, CreditCard, MapPin } from "lucide-react";

import Navbar from "../components/Navbar";
import useScrollReveal from "../hooks/useScrollReveal";
import MeasurementForm from "../components/MeasurementForm";

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

              <h1>Luxury Furniture & Interior Design</h1>

              <p>
                Share your room ideas, request a custom furniture quote, and let
                us craft a stylish interior layout for your home.
              </p>

              <div className="contact-strip">
                <a
                  href="https://wa.me/447440092312"
                  target="_blank"
                  rel="noreferrer"
                  className="strip-card"
                >
                  <MessageCircle size={22} />

                  <div>
                    <strong>WhatsApp</strong>
                    <span>Fastest response</span>
                  </div>
                </a>

                <a href="mailto:moris.era@yahoo.com" className="strip-card">
                  <Mail size={22} />

                  <div>
                    <strong>Email</strong>
                    <span>moris.era@yahoo.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="container reveal measurement-layout">
          <MeasurementForm />

          <div className="contact-info-panel hover-lift">
            <h2>Why Clients Choose Moris Clothings</h2>

            <div className="info-list">
              <div>
                <MapPin size={20} />
                <span>United Kingdom furniture & interior design service</span>
              </div>

              <div>
                <Phone size={20} />
                <span>+44 7440 092312</span>
              </div>

              <div>
                <span>@moris.era</span>
              </div>

              <div>
                <CreditCard size={20} />
                <span>Secure Stripe Payments Coming Soon</span>
              </div>
            </div>

            <p>
              Every request is reviewed personally, and we will contact you after
              submission to confirm your materials, dimensions, and design
              preferences.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
