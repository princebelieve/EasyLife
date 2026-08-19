import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";
import { ArrowRight, HeartPulse, Sprout, Users } from "lucide-react";

const milestones = [
  { year: "01", title: "Start with natural wellness", text: "Learn how quality products, healthy habits, and wellness education can support a stronger everyday life.", icon: Sprout },
  { year: "02", title: "Build knowledge and confidence", text: "Develop practical skills through training, mentorship, leadership, customer relationships, and financial literacy.", icon: Users },
  { year: "03", title: "Create meaningful impact", text: "Use your growth to improve lives, support your community, and build a future with health, wealth, and freedom.", icon: HeartPulse },
];

export default function Journey() {
  useScrollReveal();
  return <><Navbar /><main className="journey-page"><section className="journey-hero reveal"><div className="container journey-hero-grid"><div><span className="eyebrow">THE EASY LIFE JOURNEY</span><h1>Healthy body. Strong mind. Financial freedom.</h1><p>Every Easy Life story begins with a decision to learn, grow, and live with greater intention. Your journey can start with wellness, community, training, or opportunity.</p><Link className="easy-btn easy-btn-primary breathing-button" to="/register">Start your journey <ArrowRight size={18} /></Link></div><img className="breathing-image" src="/image-67.png" alt="Easy Life networking and opportunity journey" /></div></section><section className="section reveal"><div className="container"><div className="easy-section-heading"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Progress is built one meaningful step at a time.</h2></div><div className="journey-milestones">{milestones.map(({ year, title, text, icon: Icon }) => <article className="journey-card content-card" key={year}><span className="journey-number">{year}</span><Icon size={30} /><h2>{title}</h2><p>{text}</p></article>)}</div></div></section><section className="journey-stories reveal"><div className="container journey-stories-grid"><div><span className="eyebrow">REAL PEOPLE. REAL RESULTS.</span><h2>Stories make the journey visible.</h2><p>Read and watch experiences from people building healthier lives, stronger communities, and new opportunities with Easy Life Wellness Hub.</p><Link className="easy-btn easy-btn-primary breathing-button" to="/testimonials">Explore stories <ArrowRight size={18} /></Link></div><img className="breathing-image" src="/image-12.png" alt="Easy Life community members sharing a journey" /></div></section></main><Footer /></>;
}
