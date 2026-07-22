import { Link } from "react-router"
import "../CompCss/Landing.css"
import logo from "../assets/imgs/logo.png"
import { storeCards, servicesCards } from "../StateTemps"

const BGlogoLink = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2560&auto=format&fit=crop"

function HeroSection() {
    return (
        <header className="hero-section">
            <div className="logo-box">
                <img src={logo} alt="Logo" className="main-logo bounce-anim" />
            </div>

            <h1 className="hero-title">
                HNK <span className="accent-text">STORE</span>
            </h1>

            <p className="hero-subtitle">
                A modern store for PC games, digital services, and competitive global deals.
            </p>

            <div className="hero-buttons">
                <Link to="/games" className="btn btn-primary">
                    <i className="fa-solid fa-gamepad"></i> Browse Store
                </Link>

                <Link to="/games" className="btn btn-outline">
                    <i className="fa-solid fa-fire"></i> Today&apos;s Offers
                </Link>
            </div>
        </header>
    )
}

function CardSection({ title, icon, items, variant }) {
    return (
        <section className={`premium-section ${variant === "services" ? "mt-5" : ""}`}>
            <div className="section-header">
                <h2 className="cyber-title">
                    <i className={`fa-solid ${icon}`}></i> {title}
                </h2>

                <div className={`line-deco ${variant === "services" ? "secondary-deco" : ""}`}></div>
            </div>

            <div className={`cyber-grid ${variant === "services" ? "two-cols" : ""}`}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`cyber-card ${variant === "services" ? "service-card" : ""}`}
                    >
                        <div className={`card-glow ${variant === "services" ? "alt" : ""}`}></div>
                        <i className={`fa-solid ${item.icon} card-icon`}></i>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default function LandingPage() {
    return (
        <>
            <div className="video-bg">
                <div className="overlay-gradient"></div>
                <img src={BGlogoLink} className="bg-image" alt="Gaming setup background" />
            </div>

            <div className="glass-container" style={{ position: 'relative' }}>
                <div className="auth-btn-group" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                    <Link to="/login?view=login" className="btn auth-btn-outline auth-btn-small">
                        Sign In
                    </Link>
                    <Link to="/login?view=register" className="btn auth-btn-primary auth-btn-small">
                        Register
                    </Link>
                </div>

                <HeroSection />

                <CardSection
                    title="Game Store"
                    icon="fa-store"
                    items={storeCards}
                />

                <CardSection
                    title="Digital Services"
                    icon="fa-bolt"
                    items={servicesCards}
                    variant="services"
                />

                <footer className="cyber-footer">
                    <div className="footer-content">
                        <img src={logo} className="footer-logo" alt="logo" />
                        <p>2026 HnK Store. All rights reserved.</p>
                        <div className="socials">
                            <i className="fa-brands fa-discord"></i>
                            <i className="fa-brands fa-instagram"></i>
                            <i className="fa-brands fa-facebook"></i>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
