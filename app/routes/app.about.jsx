import { useState } from "react";
import "./styled/about.css";

// ── Data ──────────────────────────────────────────────────────────────────────
const team = [
  { name: "Aryan Shah",   role: "Founder & CEO",      avatar: "AS", color: "#E63946", bio: "Passionate about e-commerce innovation and helping Shopify merchants grow their revenue through smart wishlist tools." },
  { name: "Meera Patel",  role: "Lead Developer",      avatar: "MP", color: "#4ECDC4", bio: "Full-stack engineer with 8+ years building scalable Shopify apps. Obsessed with performance and clean code." },
  { name: "James Liu",    role: "UX Designer",         avatar: "JL", color: "#F4A261", bio: "Crafting beautiful, intuitive interfaces that merchants and customers love. Design is everything." },
  { name: "Sofia Russo",  role: "Customer Success",    avatar: "SR", color: "#BB8FCE", bio: "Dedicated to making every merchant successful. Available 24/7 to ensure your wishlist app runs perfectly." },
];

const stats = [
  { value: "12K+",  label: "Merchants",         icon: "🏪" },
  { value: "4.9★",  label: "App Rating",         icon: "⭐" },
  { value: "2M+",   label: "Wishlists Created",  icon: "❤️" },
  { value: "99.9%", label: "Uptime",             icon: "⚡" },
];

const values = [
  { icon: "🎯", title: "Merchant First",     desc: "Every feature we build starts with one question: does this help merchants sell more?" },
  { icon: "🔒", title: "Privacy & Trust",    desc: "Customer data is sacred. We never sell or misuse the information entrusted to us." },
  { icon: "⚡", title: "Lightning Fast",     desc: "Our theme extension adds zero perceptible load time to your storefront." },
  { icon: "🤝", title: "Always Supportive",  desc: "Real humans, real help. Our support team responds within 2 hours, every day." },
];

const features = [
  { icon: "📧", title: "Smart Alerts",     desc: "Auto-notify customers when wished items go on sale" },
  { icon: "📊", title: "Deep Analytics",   desc: "Know exactly which products customers desire most" },
  { icon: "🎨", title: "Theme Native",     desc: "Seamlessly blends with any Shopify theme" },
  { icon: "🚀", title: "One-Click Setup",  desc: "Live in minutes, no developer needed" },
];

const devTags = [
  { label: "Shopify Expert",   icon: "🛍️" },
  { label: "React Developer",  icon: "⚛️" },
  { label: "Open to Collab",   icon: "🤝" },
];

const devQuickStats = [
  { val: "5+ yrs", label: "Building Apps"  },
  { val: "12K+",   label: "Merchants"      },
  { val: "2 hrs",  label: "Avg Response"   },
];

const devContacts = [
  { icon: "📧", label: "Email",       value: "aryan@wishlistpro.app",       sub: "Direct line to the founder",   color: "#E63946", link: "mailto:aryan@wishlistpro.app" },
  { icon: "🐙", label: "GitHub",      value: "github.com/aryanshah",        sub: "Open source & contributions",  color: "#1A1A2E", link: "https://github.com"           },
  { icon: "🐦", label: "Twitter / X", value: "@aryanshah_dev",              sub: "Tech updates & announcements", color: "#45B7D1", link: "https://twitter.com"          },
  { icon: "💼", label: "LinkedIn",    value: "linkedin.com/in/aryanshah",   sub: "Professional network",         color: "#0A66C2", link: "https://linkedin.com"         },
  { icon: "🌐", label: "Website",     value: "aryanshah.dev",               sub: "Portfolio & blog",             color: "#4ECDC4", link: "https://aryanshah.dev"        },
  { icon: "💬", label: "Discord",     value: "WishList Pro Community",      sub: "Join the merchant community",  color: "#5865F2", link: "https://discord.com"          },
];

const footerLinks = ["Privacy Policy", "Terms of Service", "Docs"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [hoveredTeam,    setHoveredTeam]    = useState(null);
  const [hoveredContact, setHoveredContact] = useState(null);

  return (
    <div id="about-root">
      <div id="about-inner">

        {/* ── HERO ── */}
        <section id="hero">
          <div id="hero-blob-tr" className="hero-blob" />
          <div id="hero-blob-bl" className="hero-blob" />
          <div id="hero-blob-ml" className="hero-blob" />
          <div id="hero-float-icon">❤️</div>

          <div id="hero-brand">
            <div id="hero-logo">❤️</div>
            <span id="hero-brand-name">WishList Pro</span>
          </div>

          <div id="hero-content">
            <div className="section-label section-label--hero">
              <span>✦</span> Our Story
            </div>
            <h1 id="hero-title">
              Built for Merchants,{" "}
              <span className="hero-title-gradient">Loved by Customers</span>
            </h1>
            <p id="hero-desc">
              WishList Pro was born from a simple frustration — customers forgetting what they loved.
              We built the most powerful, beautiful wishlist solution for Shopify stores so your customers
              never lose track of what they want, and you never lose a sale.
            </p>
            <div id="hero-actions">
              <button className="shimmer-btn">❤️ Start Free Trial</button>
              <button className="ghost-btn">📖 View Docs</button>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div id="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-pill" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-pill__icon" style={{ animationDelay: `${i * 0.4}s` }}>{s.icon}</div>
              <div className="stat-pill__value">{s.value}</div>
              <div className="stat-pill__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MISSION ── */}
        <div id="mission-row">
          <div id="mission-copy">
            <div className="section-label"><span>🎯</span> Our Mission</div>
            <h2 id="mission-title">Turning Wishlists Into Revenue</h2>
            <p className="mission-para">
              We believe every "saved for later" is a sale waiting to happen. Our mission is to give
              Shopify merchants the tools to understand what customers want, and act on it at exactly
              the right moment.
            </p>
            <p className="mission-para">
              From back-in-stock alerts to low-inventory nudges, WishList Pro transforms passive
              interest into active purchases — automatically.
            </p>
          </div>

          <div id="mission-features">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="feature-card__icon">{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <div className="feature-card__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VALUES ── */}
        <section id="values-section">
          <div className="section-center">
            <div className="section-label section-label--center"><span>💡</span> What We Stand For</div>
            <h2 className="section-heading">Our Core Values</h2>
          </div>
          <div id="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="value-card__icon">{v.icon}</div>
                <div className="value-card__title">{v.title}</div>
                <div className="value-card__desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team-section">
          <div className="section-center">
            <div className="section-label section-label--center"><span>👥</span> The People</div>
            <h2 className="section-heading section-heading--mb">Meet the Team</h2>
            <p className="section-sub">A small, passionate team obsessed with your success</p>
          </div>

          <div id="team-grid">
            {team.map((member, i) => (
              <div
                key={i}
                className="team-card"
                style={{ animationDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredTeam(i)}
                onMouseLeave={() => setHoveredTeam(null)}
              >
                <div
                  className="team-card__bar"
                  style={{ background: `linear-gradient(90deg,${member.color},${member.color}88)` }}
                />
                <div
                  className={`team-card__avatar${hoveredTeam === i ? " team-card__avatar--hovered" : ""}`}
                  style={{
                    background: `linear-gradient(135deg,${member.color},${member.color}99)`,
                    boxShadow: `0 6px 20px ${member.color}40`,
                  }}
                >
                  {member.avatar}
                </div>
                <div className="team-card__name">{member.name}</div>
                <div
                  className="team-card__role"
                  style={{ color: member.color, background: `${member.color}12` }}
                >
                  {member.role}
                </div>
                <p className="team-card__bio">{member.bio}</p>
                <div className="team-card__socials">
                  {["💼", "🐦"].map((icon, j) => (
                    <div key={j} className="social-btn">{icon}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DEVELOPER CONTACT ── */}
        <section id="dev-section">

          {/* Profile card */}
          <div id="dev-profile">
            <div id="dev-blob-tr" />
            <div id="dev-blob-bl" />

            <div id="dev-profile-inner">
              <div id="dev-avatar-wrap">
                <div id="dev-avatar">AS</div>
                <div id="dev-online"><span className="online-dot" /></div>
              </div>

              <div id="dev-info">
                <div id="dev-name-row">
                  <h2 id="dev-name">Aryan Shah</h2>
                  <span id="dev-badge">FOUNDER & CEO</span>
                </div>
                <p id="dev-bio">
                  Building WishList Pro from Ahmedabad, India. Passionate about helping Shopify merchants
                  grow through smart tools. Available for partnerships, collaborations, and merchant support.
                </p>
                <div id="dev-tags">
                  {devTags.map((tag, i) => (
                    <span key={i} className="dev-tag">{tag.icon} {tag.label}</span>
                  ))}
                </div>
              </div>

              <div id="dev-quick-stats">
                {devQuickStats.map((s, i) => (
                  <div key={i} className="dev-quick-stat">
                    <div className="dev-quick-stat__val">{s.val}</div>
                    <div className="dev-quick-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact intro */}
          <div id="contact-intro">
            <div className="section-label section-label--center"><span>📬</span> Developer Contacts</div>
            <p>Reach out through any of these channels</p>
          </div>

          {/* Contact grid */}
          <div id="contact-grid">
            {devContacts.map((c, i) => (
              <a
                key={i}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
                style={{ animationDelay: `${i * 0.08}s` }}
                onMouseEnter={() => setHoveredContact(i)}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <div className="contact-card__inner">
                  <div
                    className={`contact-card__icon-wrap${hoveredContact === i ? " contact-card__icon-wrap--hovered" : ""}`}
                    style={{
                      background: `${c.color}12`,
                      border: `1.5px solid ${c.color}25`,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div className="contact-card__label">{c.label}</div>
                    <div
                      className="contact-card__value"
                      style={hoveredContact === i ? { color: c.color } : {}}
                    >
                      {c.value}
                    </div>
                    <div className="contact-card__sub">{c.sub}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── FOOTER STRIP ── */}
        <footer id="footer-strip">
          <div id="footer-brand">
            <div id="footer-logo">❤️</div>
            <div>
              <div id="footer-name">WishList Pro</div>
              <div id="footer-copy">© 2024 WishList Pro. All rights reserved.</div>
            </div>
          </div>

          <div id="footer-links">
            {footerLinks.map((link, i) => (
              <button key={i} className="footer-link">{link}</button>
            ))}
          </div>

          <div id="footer-made">Made with ❤️ in Ahmedabad, India</div>
        </footer>

      </div>
    </div>
  );
}