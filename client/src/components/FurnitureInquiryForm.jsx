// Legacy component retained for the existing inquiry API contract.
import { useState } from "react";
import { submitInquiry } from "../services/api";

export default function WellnessInquiryForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    projectType: "",
    roomType: "",
    budget: "",
    timeline: "",
    message: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await submitInquiry(form);

      alert(
        "Inquiry submitted successfully! We'll contact you within 24 hours.",
      );

      setForm({
        fullName: "",
        email: "",
        phone: "",
        projectType: "",
        roomType: "",
        budget: "",
        timeline: "",
        message: "",
      });
    } catch (err) {
      alert(err.message || "Failed to submit inquiry");
    }
  }

  return (
    <div className="measurement-form">
      <div className="measurement-header">
          <h2>Start Your Wellness Journey</h2>
        <p>
          Tell us what you would like to explore and our team will guide you
          toward wellness products, testing, training, or community support.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="measurement-grid">
          <div className="two-col">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <div className="two-col">
            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              required
            >
              <option value="">Select Wellness Interest *</option>
              <option value="wellness-products">Wellness Products</option>
              <option value="test-checkup">Test & Checkup</option>
              <option value="training">Training & Leadership</option>
              <option value="network-marketing">Network Marketing</option>
              <option value="consultation">Wellness Consultation</option>
            </select>

            <select
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
            >
              <option value="">Area of Interest (Optional)</option>
              <option value="natural-wellness">Natural Wellness</option>
              <option value="equipment">Naturopathic Equipment</option>
              <option value="community">Community & Mentorship</option>
              <option value="financial-freedom">Financial Freedom</option>
            </select>
          </div>

          <div className="two-col">
            <select name="budget" value={form.budget} onChange={handleChange}>
              <option value="">Budget Range (Optional)</option>
              <option value="under-100000">Under ₦100,000</option>
              <option value="100000-500000">₦100,000 - ₦500,000</option>
              <option value="500000-1500000">₦500,000 - ₦1,500,000</option>
              <option value="1500000-3000000">₦1,500,000 - ₦3,000,000</option>
              <option value="over-3000000">Over ₦3,000,000</option>
            </select>

            <select
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
            >
              <option value="">Timeline (Optional)</option>
              <option value="asap">ASAP</option>
              <option value="1-3-months">1-3 Months</option>
              <option value="3-6-months">3-6 Months</option>
              <option value="6-months-plus">6+ Months</option>
              <option value="just-planning">Just Planning</option>
            </select>
          </div>

          <textarea
            name="message"
            placeholder="Tell us about your wellness goals or any specific requirements..."
            value={form.message}
            onChange={handleChange}
            rows="4"
          />

          <button type="submit" className="measurement-submit">
            Submit Inquiry
          </button>
        </div>
      </form>
    </div>
  );
}
