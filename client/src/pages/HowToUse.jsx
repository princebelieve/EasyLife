import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../context/AuthContext";

const customerSteps = [
  ["1", "Choose guest or account checkout", "You can pay online as a guest for a first order, or create an account to keep your cart, order history, delivery updates, and notifications connected to you."],
  ["2", "Choose products", "Open Shop, read the product information, select Buy Now or add products to your cart, then adjust quantities or remove products before checkout."],
  ["3", "Choose how to receive the order", "Choose Easy Life office pickup in Benin City to pay no shipping fee, or choose delivery to a transport company or park in your selected state. Delivery is for collection at the terminal, not doorstep delivery."],
  ["4", "Enter collection details", "For transport delivery, provide your address or nearest landmark, state, and preferred transport company or park. The address helps with routing; it does not mean doorstep delivery."],
  ["5", "Confirm one delivery fee", "The configured fee for your selected state is charged once for the complete order, no matter how many products are in your cart."],
  ["6", "Choose payment", "Pay online through Paystack, use direct Easy Life bank transfer when enabled, or choose the pay-on-delivery transfer instruction. The delivery agent confirms an official transfer before handover and does not collect cash."],
  ["7", "Complete and follow up", "Use Dashboard to view orders, restart an incomplete Paystack payment, see payment and delivery status, and send your receipt or order summary to WhatsApp when requested."],
];

const distributorSteps = [
  ["Apply", "From Dashboard, choose Apply to become a distributor. Enter your business details, pickup location, delivery coverage, and bank account. The account name is verified before the application is submitted."],
  ["Wait for approval", "An administrator reviews the application. Approval unlocks the Distributor Dashboard and creates a personal distributor code and shop link."],
  ["Buy stock at distributor price", "Use the wholesale catalogue to buy eligible stock at its distributor price and minimum quantity. Paystack payment confirmation adds the stock to your distributor inventory."],
  ["Set up your shop", "Confirm the verified payout account, pickup address, and whether your customers can use pickup or transport-company delivery."],
  ["Share your link", "Customers using your personal link see only products you currently have in distributor inventory and can follow your available fulfilment options."],
  ["Keep inventory accurate", "Record direct sales in the Distributor Dashboard. Paid customer orders made through your store also reduce your available distributor stock."],
];

const adminTasks = [
  ["Products", "Create, edit, publish, approve, or manage product catalogue details, prices, stock, images, descriptions, and Merchant Center fields such as GTIN, brand, and product category."],
  ["Orders and delivery", "Open each order to review customer details, transport collection point, payment status, delivery status, and fulfilment notes. Confirm payment before dispatch or handover."],
  ["Shipping and transport", "Set one whole-order delivery fee for each Nigerian state, manage optional backup policies, and maintain the transport company list customers can select."],
  ["Payments", "Configure official Easy Life bank-transfer details and decide whether direct transfer is available alongside Paystack."],
  ["Distributors", "Review distributor applications, approve or suspend distributors, and monitor distributor inventory and wholesale stock orders."],
  ["People, content, and notices", "Manage users, review subadmin requests, publish content studio posts and adverts, respond to enquiries, and send or approve notifications."],
];

const subadminTasks = [
  ["Product work", "Subadmins can access the product workspace to add products and prepare catalogue updates. Administrator approval and publishing rules still apply."],
  ["Content work", "Subadmins can work in Content Studio to prepare posts and media. Follow the approval process where the system marks a submission as pending."],
  ["Notifications", "Subadmins can prepare individual or broadcast notifications. These are submitted for an administrator to approve before they are delivered."],
  ["Access boundary", "Subadmins do not control users, payments, state shipping rates, transport companies, order fulfilment, distributor approval, or administrator-only sales and stock controls."],
];

function StepList({ items, numbered = false }) {
  return <div className="how-to-use-steps">
    {items.map(([numberOrTitle, titleOrDescription, maybeDescription], index) => {
      const title = numbered ? titleOrDescription : numberOrTitle;
      const description = numbered ? maybeDescription : titleOrDescription;
      return <article className="how-to-use-step content-card" key={title}>
        <span>{numbered ? numberOrTitle : index + 1}</span>
        <div><h3>{title}</h3><p>{description}</p></div>
      </article>;
    })}
  </div>;
}

export default function HowToUse() {
  const { isAdmin, isSubadmin } = useAuth();
  return (
    <>
      <Navbar />
      <main className="how-to-use-page">
        <section className="how-to-use-hero"><div className="container"><span className="eyebrow">EASY LIFE APP GUIDE</span><h1>How Easy Life works for every role.</h1><p>Use this guide to shop, receive an order, become a distributor, or manage the platform as an administrator or subadmin.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary" to="/collection">Start shopping</Link><Link className="easy-btn easy-btn-light" to="/dashboard">Open my dashboard</Link></div></div></section>

        <section className="section"><div className="container"><div className="how-to-use-heading"><span className="eyebrow">EVERY VISITOR</span><h2>Start in the right place</h2><p>Anyone can browse the public shop, product details, education posts, contact page, support guide, policies, and this guide. Sign in is required only when you need a cart, checkout, order history, notifications, or a role dashboard.</p></div><aside className="how-to-use-note"><strong>Installed app:</strong> Install from a supported mobile browser if you want app-style access. Enable notifications only if you want order and account alerts; you can change the permission in your device settings later.</aside></div></section>

        <section className="section"><div className="container"><div className="how-to-use-heading"><span className="eyebrow">CUSTOMERS</span><h2>How to make a purchase</h2><p>Review your choices before payment, then use your dashboard for payment and fulfilment updates.</p></div><StepList items={customerSteps} numbered /></div></section>

        <section className="how-to-use-payment"><div className="container how-to-use-payment-grid"><div><span className="eyebrow">PAYMENT AND DELIVERY</span><h2>Important checkout rules</h2></div><div className="how-to-use-payment-list"><p><strong>Office pickup:</strong> Pickup from Easy Life in Benin City has no shipping fee.</p><p><strong>Transport delivery:</strong> Your order is sent to the selected or confirmed transport company/park in your state for collection.</p><p><strong>Payment before handover:</strong> For pay-on-delivery transfer, the customer transfers to the official account at handover; the agent verifies payment before releasing the parcel.</p><p><strong>Distributor shopping:</strong> A distributor link shows that distributor's stock and, where enabled, their verified transfer account. Easy Life payment options remain available as shown at checkout.</p></div></div></section>

        <section className="section"><div className="container"><div className="how-to-use-heading"><span className="eyebrow">DISTRIBUTORS</span><h2>How the distributor role works</h2><p>Distributors buy stock at an approved distributor price, then sell from a controlled personal store linked to their own inventory.</p></div><StepList items={distributorSteps} /><aside className="how-to-use-note"><strong>Important:</strong> Distributor stock and central Easy Life stock are separate. A distributor cannot sell more units through their link than are in their approved inventory.</aside></div></section>

        {isAdmin ? <section className="section"><div className="container"><div className="how-to-use-heading"><span className="eyebrow">ADMINISTRATORS</span><h2>Platform-owner controls</h2><p>Administrators have the final responsibility for catalogue accuracy, payments, orders, fulfilment, users, distributors, and operational settings.</p></div><StepList items={adminTasks} /></div></section> : <section className="section"><div className="container"><div className="how-to-use-heading"><span className="eyebrow">INTERNAL WORKSPACES</span><h2>Administrator and subadmin guides</h2><p>Detailed internal operating guidance is visible only to signed-in staff with the appropriate role. Contact the project owner if you need staff access.</p></div></div></section>}

        {(isAdmin || isSubadmin) && <section className="section"><div className="container"><div className="how-to-use-heading"><span className="eyebrow">SUBADMINS</span><h2>Controlled publishing support</h2><p>Subadmins help with catalogue, content, and communication work without receiving full financial or operational control.</p></div><StepList items={subadminTasks} /></div></section>}

        <section className="how-to-use-help"><div className="container"><h2>Need help with an order or application?</h2><p>Use the support guide for answers, or contact Easy Life for help with products, transport collection, payment, distributor applications, or account access.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary" to="/support">Open support guide</Link><Link className="easy-btn easy-btn-light" to="/contact">Contact Easy Life</Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
