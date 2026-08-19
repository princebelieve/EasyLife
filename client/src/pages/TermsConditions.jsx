import Navbar from "../components/Navbar";

export default function TermsConditions() {
  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <a className="cta" href="/privacy-policy">Privacy Policy</a>
          <a className="cta" href="/refund-policy">Refund Policy</a>
          <a className="cta" href="/contact">Contact Support</a>
        </div>

        <h1>Terms & Conditions</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>Last updated: 2026-08-18</p>

        <h2>Agreement and Definitions</h2>
        <p>
          By using the Easy Life Wellness Hub platform (the "Platform"), you
          agree to these Terms of Use and any information shown for a product,
          service, program, or checkout. "We", "our", and "Easy Life Wellness
          Hub" mean the business operating this Platform and its authorised
          representatives. These terms apply to our wellness products,
          educational resources, training, consultations, community programs,
          and related support.
        </p>

        <h2>Terms of Use</h2>
        <p>
          You may use the Platform for lawful browsing, learning,
          participation, shopping, support, and account management only. You
          must not misuse the site, attempt unauthorized access, or share false
          or misleading information. You are responsible for keeping your
          account details and login credentials accurate and secure.
        </p>

        <h2>Wellness Information</h2>
        <p>
          Information, educational materials, and activities provided through
          the Platform are for general education and wellbeing support. They do
          not constitute medical advice, diagnosis, treatment, or a substitute
          for a qualified healthcare professional. Seek professional advice for
          personal health concerns or emergencies.
        </p>

        <h2>Orders, Services, and Pricing</h2>
        <p>
          Prices are displayed in NGN. We may correct pricing errors or update
          offers, and may decline or cancel transactions where availability,
          payment, service capacity, or product information is invalid. Prices,
          schedules, program details, and eligibility may change. Applicable
          delivery fees or service charges will be shown before completion.
        </p>

        <h2>Fulfilment and Delivery</h2>
        <p>
          Where physical products or materials are supplied, delivery timelines
          are estimates and may be affected by weather, logistics, and
          third-party carriers. Any missing, damaged, or incorrect item should
          be reported promptly through the Contact Support page. Details for a
          specific service or program may be provided at registration or
          checkout.
        </p>

        <h2>Payment</h2>
        <p>
          We use third-party payment processors such as Paystack. Payment
          processing is subject to the processor's terms. A transaction is not
          complete until payment is successfully authorised and we confirm it.
        </p>

        <h2>Returns and Refunds</h2>
        <p>
          Our full return and refund rules are available on the{" "}
          <a href="/refund-policy">Refund & Returns Policy</a> page. Refunds
          are processed to the original payment method where possible. A
          defect, missing item, or other issue must be reported within the
          period stated in the applicable policy or order information.
        </p>

        <h2>Liability</h2>
        <p>
          To the extent allowed by law, Easy Life Wellness Hub's liability for
          any claim arising from the Platform or a transaction is limited to
          the amount paid for that transaction, except for fraud, willful
          misconduct, death, personal injury, or other liabilities that cannot
          be excluded by law. Nothing in these terms excludes your consumer
          rights under Nigerian law.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of Nigeria.</p>

        <h2>Contact</h2>
        <p>
          For questions about these terms, use the{" "}
          <a href="/contact">Contact Support</a> page or email
          support@easylifewellnesshub.com.
        </p>
      </div>
    </>
  );
}