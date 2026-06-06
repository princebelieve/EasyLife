import Navbar from "../components/Navbar";

export default function RefundPolicy() {
  return (
    <>
      <Navbar />
      <div
        className="page"
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}
      >
        <h1>Refund & Returns Policy</h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Last updated: 2026-06-06
        </p>

        <h2>Overview</h2>
        <p>
          At Newbrend Furniture we want you to be happy with your purchase. If a
          product is defective, damaged during delivery, or materially not as
          described, you may be eligible for a refund, replacement, or repair.
        </p>

        <h2>Eligibility</h2>
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
            Contact support via email at support@newbrend.example or call our
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
          processor. Refunds exclude any shipping or delivery charges unless the
          return is due to our error.
        </p>

        <h2>Collections and Return Shipping</h2>
        <p>
          For large furniture items, we may arrange a pickup. If the return is
          due to our error, we will cover collection costs; otherwise,
          collection/shipping costs may be charged.
        </p>

        <h2>Warranty</h2>
        <p>
          Products may include a manufacturer warranty where applicable.
          Warranty claims are handled in accordance with the manufacturer's
          terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about refunds or returns should be directed to
          support@newbrend.example or via the contact form on the site.
        </p>
      </div>
    </>
  );
}
