import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";

const activities = [
  { title: "Community wellness education", text: "We create spaces where families, schools, churches, NGOs, and community groups can learn about healthier living and prevention.", image: "/image-12.png" },
  { title: "Product and checkup days", text: "Partners can host product showcases, wellness education, and available testing or checkup activities for their communities.", image: "/image-13.png" },
  { title: "Partnership and impact", text: "Organizations can work with Easy Life to sponsor learning, support local initiatives, and create practical opportunities.", image: "/image-67.png" },
];

export default function Outreach() {
  useScrollReveal();
  return <><Navbar /><main className="outreach-page"><section className="outreach-hero reveal"><div className="container outreach-hero-grid"><div><span className="eyebrow">EASY LIFE COMMUNITY IMPACT</span><h1>Growing healthier, stronger communities together.</h1><p>Our outreach activities connect wellness education, practical support, partnerships, and opportunity with the people and organizations that need them.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary breathing-button" to="/contact">Plan an outreach <ArrowRight size={18} /></Link><Link className="easy-btn easy-btn-light breathing-button" to="/testimonials">See community stories</Link></div></div><img className="breathing-image" src="/image-12.png" alt="Easy Life Wellness Hub community team" /></div></section><section className="section reveal"><div className="container"><div className="easy-section-heading"><span className="eyebrow">WHAT WE DO</span><h2>Outreach that turns good intentions into useful action.</h2></div><div className="outreach-grid">{activities.map((activity) => <article className="outreach-card content-card" key={activity.title}><img src={activity.image} alt={activity.title} /><div><h2>{activity.title}</h2><p>{activity.text}</p></div></article>)}</div></div></section><section className="outreach-commitment reveal"><div className="container outreach-commitment-grid"><HeartHandshake size={48} /><div><span className="eyebrow">PARTNERS WELCOME</span><h2>Bring your people, purpose, and ideas.</h2><p>Schools, churches, NGOs, companies, wellness practitioners, and community associations can contact us to discuss a learning event, sponsorship, product showcase, or partnership.</p><Link className="easy-text-link" to="/contact">Discuss a partnership <ArrowRight size={17} /></Link></div><Users size={48} /></div></section></main><Footer /></>;
}
