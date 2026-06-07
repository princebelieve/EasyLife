import Navbar from "../components/Navbar";

export default function TermsConditions() {
  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}
      >
        <h1>Terms & Conditions</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Last updated: 2026-06-06
        </p>

        <h2>Agreement</h2>
        <p>
          By using the Newbrend Furniture website you agree to these terms.
          Please read them carefully.
        </p>

        <h2>Orders and Pricing</h2>
        <p>
          Prices are displayed in NGN. We reserve the right to correct pricing
          errors. Orders are subject to acceptance and availability.
        </p>

        <h2>Shipping and Delivery</h2>
        <p>
          Delivery timelines are estimates. Shipping fees are calculated at
          checkout based on your delivery address and selected options.
        </p>

        <h2>Payment</h2>
        <p>
          We use third-party payment processors (for example Paystack). Payments
          are subject to the processor's terms.
        </p>

        <h2>Returns and Refunds</h2>
        <p>
          Our refund policy is available on the Refund & Returns page. Refunds
          are processed to the original payment method where possible.
        </p>

        <h2>Liability</h2>
        <p>
          To the fullest extent permitted by law, Newbrend's liability is
          limited to the purchase price of the product.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of Nigeria.</p>

        <h2>Contact</h2>
        <p>For questions about these terms, contact newbrend001@gmail.com.</p>
      </div>
    </>
  );
}
