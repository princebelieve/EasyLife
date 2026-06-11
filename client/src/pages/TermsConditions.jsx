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

        <h2>Agreement</h2>
        <p>
          By using the Newbrend Furniture website, you agree to these terms and
          any product-specific information shown on the product page, checkout,
          or delivery confirmation. These terms apply to all products and
          services offered by NewBrend, including ready-to-ship items, custom
          orders, and made-to-order products.
        </p>

        <h2>Orders and Pricing</h2>
        <p>
          Prices are displayed in NGN. We reserve the right to correct pricing
          errors or update offers, and we may decline or cancel orders where
          stock, payment, delivery, or product information is invalid. Delivery
          fees and estimated times may vary by state, city, product category,
          and whether the item is custom, bulky, or requires installation.
          Free delivery, if offered, applies only to eligible orders and will
          be clearly stated at checkout.
        </p>

        <h2>Shipping and Delivery</h2>
        <p>
          Delivery timelines are estimates and may be affected by weather,
          logistics, third-party carriers, custom order production time, or
          installation requirements. Please inspect items on delivery and report
          any damage, shortage, or incorrect item promptly. If a product is
          defective or not as described, please contact us immediately so we
          can assist under our refund, replacement, or support policies.
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
          Our refund policy is available on the Refund & Returns page. Refunds
          are processed to the original payment method where possible.
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
