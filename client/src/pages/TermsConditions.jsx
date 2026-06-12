import Navbar from "../components/Navbar";

export default function TermsConditions() {
  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <a className="cta" href="/privacy-policy">
            Privacy Policy
          </a>
          <a className="cta" href="/refund-policy">
            Refund Policy
          </a>
          <a className="cta" href="/contact">
            Contact Support
          </a>
        </div>

        <h1>Terms & Conditions</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Last updated: 2026-06-06
        </p>

        <h2>Agreement and Definitions</h2>
        <p>
          By using the NewBrend Furniture & Interior platform (the “Platform”),
          you agree to these Terms of Use and any product-specific information
          shown on the product page, checkout, or delivery confirmation. “We”,
          “our”, and “NewBrend Furniture & Interior” mean the business operating
          this Platform and its authorised representatives. These terms apply to
          all products and services offered by NewBrend Furniture & Interior,
          including ready-to-ship items, custom orders, made-to-order products,
          and delivery or installation-related services.
        </p>

        <h2>Terms of Use</h2>
        <p>
          You may use the Platform for lawful shopping, support, and account
          management only. You must not misuse the site, attempt unauthorized
          access, or share false or misleading information. By placing an order,
          you confirm that the details you provide are accurate and that you are
          authorised to receive the goods at the delivery address.
        </p>

        <h2>Orders and Pricing</h2>
        <p>
          Prices are displayed in NGN. We reserve the right to correct pricing
          errors or update offers, and we may decline or cancel orders where
          stock, payment, delivery, or product information is invalid. Delivery
          fees and estimated times may vary by state, city, product category,
          and whether the item is custom, bulky, or requires installation. Free
          delivery, if offered, applies only to eligible orders and will be
          clearly stated at checkout.
        </p>

        <h2>Shipping and Delivery</h2>
        <p>
          Delivery timelines are estimates and may be affected by weather,
          logistics, third-party carriers, custom order production time, or
          installation requirements. Please inspect items on delivery before
          accepting the package. Any damage, shortage, missing item, or wrong
          product must be reported immediately and, where possible, noted on the
          delivery record before the item leaves the delivery or logistics
          custody. If you do not confirm these issues at delivery, the right to
          claim a refund or return for that damage or shortage may be void.
          Please also see our{" "}
          <a href="/refund-policy">Refund & Returns Policy</a> for the full
          return, reporting, and shipping rules.
        </p>

        <h2>Payment</h2>
        <p>
          We use third-party payment processors (for example Paystack). Payment
          processing is subject to the processor’s terms and our order
          confirmation. An order is not considered completed until payment is
          successfully authorised and we confirm the order.
        </p>

        <h2>Returns and Refunds</h2>
        <p>
          Our full return and refund rules are available on the{" "}
          <a href="/refund-policy">Refund & Returns Policy</a> page. Refunds are
          processed to the original payment method where possible. Any
          oversight, defect, or missing item must be reported within 7 days of
          delivery, and returned goods must be returned in a neat condition and,
          where applicable, with the original packaging.
        </p>

        <h2>Liability</h2>
        <p>
          To the extent allowed by law, Newbrend’s liability for any claim
          arising from the website or an order is limited to the amount paid for
          that order, except for fraud, willful misconduct, death, personal
          injury, or other liabilities that cannot be excluded by law. Nothing
          in these terms excludes your consumer rights under Nigerian law or
          platform rules applicable to our store.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of Nigeria.</p>

        <h2>Contact</h2>
        <p>
          For questions about these terms, use the{" "}
          <a href="/contact">Contact Support</a> page or email
          newbrend001@gmail.com.
        </p>
      </div>
    </>
  );
}
