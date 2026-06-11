import Navbar from "../components/Navbar";

export default function RefundPolicy() {
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
          <a className="cta" href="/terms-conditions">
            Terms & Conditions
          </a>
          <a className="cta" href="/contact">
            Contact Support
          </a>
        </div>

        <h1>Refund & Returns Policy</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Last updated: 2026-06-06
        </p>

        <h2>Overview</h2>
        <p>
          At Newbrend Furniture, we want you to be satisfied with your purchase.
          This policy applies to all products sold by NewBrend, including
          furniture, decor, ready-to-ship goods, made-to-order products, and
          custom design or installation-related items, unless a specific product
          page states a different return or warranty term. If a product is
          defective, damaged on arrival, or materially different from the
          description, you may be eligible for a refund, replacement, or repair,
          subject to this policy and applicable consumer protection rights.
        </p>

        <h2>Eligibility</h2>
        <p>
          To qualify, you must notify us promptly and provide evidence such as
          order number, photos, and a brief description of the issue.
        </p>
        <ul>
          <li>Report damaged or defective items within 7 days of delivery.</li>
          <li>
            To be eligible for a refund or replacement the product must be in
            substantially the same condition as delivered and include any
            supplied accessories and documentation.
          </li>
          <li>
            Custom-made or bespoke products, and items clearly marked as
            non-returnable, are not eligible unless faulty.
          </li>
          <li>
            Products damaged after delivery due to misuse, incorrect
            installation, or normal wear and tear are not eligible.
          </li>
        </ul>

        <h2>How to Request a Return</h2>
        <ol>
          <li>
            Contact support via email at newbrend001@gmail.com or call our
            support line with your order reference and photos of the issue.
          </li>
          <li>
            Provide clear photos and a description of the defect or damage.
          </li>
          <li>
            Our support team will review and provide instructions for return or
            collection.
          </li>
        </ol>

        <h2>Refunds</h2>
        <p>
          Approved refunds will be processed to the original payment method
          within 7–14 business days, depending on your card provider or payment
          processor. Refunds exclude delivery/shipping charges unless the issue
          was caused by our error or the item was not delivered as described.
        </p>

        <h2>Collections and Return Shipping</h2>
        <p>
          For large or bulky items, custom installations, or made-to-order
          products, we may arrange collection. If the return is due to our
          error, defective goods, or a product not as described, we will cover
          return shipping/collection costs where required by law or our stated
          support process; otherwise, return shipping may be borne by the
          customer unless otherwise agreed in writing.
        </p>

        <h2>Non-Returnable / Custom Items</h2>
        <p>
          Custom-made, made-to-order, assembled-on-request, or clearly
          personalised items may not be returnable unless faulty, damaged on
          arrival, materially misdescribed, or otherwise not fit for the
          purpose described. This does not limit your rights under applicable
          Nigerian consumer protection law or any broader platform rules that
          apply to our store.
        </p>

        <h2>Warranty</h2>
        <p>
          Products may include a manufacturer warranty where applicable.
          Warranty claims are handled in accordance with the manufacturer's
          terms. This policy does not limit any rights you have under Nigerian
          consumer protection law.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about refunds or returns should be directed to the{" "}
          <a href="/contact">Contact Support</a> page, WhatsApp, or email
          newbrend001@gmail.com.
        </p>
      </div>
    </>
  );
}
