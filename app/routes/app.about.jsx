import { useState } from "react";

const team = [
  { name: "Aryan Shah", role: "Founder & CEO", avatar: "AS", color: "#E63946", bio: "Passionate about e-commerce innovation and helping Shopify merchants grow their revenue through smart wishlist tools." },
  { name: "Meera Patel", role: "Lead Developer", avatar: "MP", color: "#4ECDC4", bio: "Full-stack engineer with 8+ years building scalable Shopify apps. Obsessed with performance and clean code." },
  { name: "James Liu", role: "UX Designer", avatar: "JL", color: "#F4A261", bio: "Crafting beautiful, intuitive interfaces that merchants and customers love. Design is everything." },
  { name: "Sofia Russo", role: "Customer Success", avatar: "SR", color: "#BB8FCE", bio: "Dedicated to making every merchant successful. Available 24/7 to ensure your wishlist app runs perfectly." },
];

const stats = [
  { value: "12K+", label: "Merchants", icon: "🏪" },
  { value: "4.9★", label: "App Rating", icon: "⭐" },
  { value: "2M+", label: "Wishlists Created", icon: "❤️" },
  { value: "99.9%", label: "Uptime", icon: "⚡" },
];

const values = [
  { icon: "🎯", title: "Merchant First", desc: "Every feature we build starts with one question: does this help merchants sell more?" },
  { icon: "🔒", title: "Privacy & Trust", desc: "Customer data is sacred. We never sell or misuse the information entrusted to us." },
  { icon: "⚡", title: "Lightning Fast", desc: "Our theme extension adds zero perceptible load time to your storefront." },
  { icon: "🤝", title: "Always Supportive", desc: "Real humans, real help. Our support team responds within 2 hours, every day." },
];

const devContacts = [
  { icon: "📧", label: "Email", value: "aryan@wishlistpro.app", sub: "Direct line to the founder", color: "#E63946", link: "mailto:aryan@wishlistpro.app" },
  { icon: "🐙", label: "GitHub", value: "github.com/aryanshah", sub: "Open source & contributions", color: "#1A1A2E", link: "https://github.com" },
  { icon: "🐦", label: "Twitter / X", value: "@aryanshah_dev", sub: "Tech updates & announcements", color: "#45B7D1", link: "https://twitter.com" },
  { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/aryanshah", sub: "Professional network", color: "#0A66C2", link: "https://linkedin.com" },
  { icon: "🌐", label: "Website", value: "aryanshah.dev", sub: "Portfolio & blog", color: "#4ECDC4", link: "https://aryanshah.dev" },
  { icon: "💬", label: "Discord", value: "WishList Pro Community", sub: "Join the merchant community", color: "#5865F2", link: "https://discord.com" },
];

export default function AboutPage() {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [hoveredContact, setHoveredContact] = useState(null);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F4F5F7", minHeight: "100vh", color: "#1A1A2E" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        .shimmer-btn {
          background: linear-gradient(270deg,#E63946,#FF6B6B,#FF8C69,#FF6B6B,#E63946);
          background-size: 300% 100%; animation: shimmer 3s ease infinite;
          color: white; border: none; padding: 13px 32px; border-radius: 11px;
          font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 16px rgba(230,57,70,0.35); transition: transform 0.15s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .shimmer-btn:hover { transform: translateY(-2px); }

        .stat-pill {
          background: white; border-radius: 18px; padding: 28px 24px; text-align: center;
          border: 1.5px solid #EBEBEC; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          animation: fadeUp 0.5s ease both;
          transition: all 0.28s cubic-bezier(0.34,1.4,0.64,1);
        }
        .stat-pill:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: #E63946; }

        .value-card {
          background: white; border-radius: 18px; padding: 28px 24px;
          border: 1.5px solid #EBEBEC; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          animation: fadeUp 0.5s ease both;
          transition: all 0.28s cubic-bezier(0.34,1.4,0.64,1);
          position: relative; overflow: hidden;
        }
        .value-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,#E63946,#FF8C69);
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
        }
        .value-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
        .value-card:hover::before { transform: scaleX(1); }

        .team-card {
          background: white; border-radius: 20px; padding: 28px 24px; text-align: center;
          border: 1.5px solid #EBEBEC; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          animation: fadeUp 0.5s ease both;
          transition: all 0.3s cubic-bezier(0.34,1.4,0.64,1);
          position: relative; overflow: hidden;
        }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); }

        .contact-card {
          background: white; border-radius: 18px; padding: 22px 20px;
          border: 1.5px solid #EBEBEC; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          animation: fadeUp 0.5s ease both;
          transition: all 0.28s cubic-bezier(0.34,1.4,0.64,1);
          cursor: pointer; text-decoration: none; display: block;
          position: relative; overflow: hidden;
        }
        .contact-card::after {
          content: '↗'; position: absolute; top: 14px; right: 16px;
          font-size: 14px; color: #D1D5DB; transition: all 0.2s;
        }
        .contact-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
        .contact-card:hover::after { color: #E63946; transform: translate(2px, -2px); }

        .social-btn {
          width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid #E5E7EB;
          background: white; display: flex; align-items: center; justify-content: center;
          font-size: 15px; cursor: pointer; transition: all 0.2s;
        }
        .social-btn:hover { background: #E63946; border-color: #E63946; transform: translateY(-2px); }

        .section-label {
          display: inline-flex; align-items: center; gap: 6px;
          background: #FFF0F1; color: #E63946; border: 1px solid rgba(230,57,70,0.2);
          padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 14px;
        }

        .online-dot {
          width: 10px; height: 10px; border-radius: 50%; background: #22C55E;
          display: inline-block; animation: pulse 2s ease infinite;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F3F4F6; }
        ::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #E63946; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>

        {/* ── HERO ── */}
        <div style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 55%,#0F3460 100%)", borderRadius: "0 0 32px 32px", padding: "64px 60px 56px", marginBottom: 56, position: "relative", overflow: "hidden", animation: "scaleIn 0.6s ease both" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: "radial-gradient(circle,rgba(230,57,70,0.2),transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -80, left: "35%", width: 220, height: 220, background: "radial-gradient(circle,rgba(78,205,196,0.12),transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "30%", left: -40, width: 150, height: 150, background: "radial-gradient(circle,rgba(244,162,97,0.1),transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", animation: "float 3s ease-in-out infinite", fontSize: 100, opacity: 0.1, userSelect: "none" }}>❤️</div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, position: "relative", zIndex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#E63946,#FF8C69)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(230,57,70,0.4)" }}>❤️</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: "white", opacity: 0.9 }}>WishList Pro</span>
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
            <div className="section-label" style={{ background: "rgba(230,57,70,0.15)", border: "1px solid rgba(230,57,70,0.3)", color: "#FF8C69" }}>
              <span>✦</span> Our Story
            </div>
            <h1 style={{ margin: "0 0 16px", fontSize: 46, fontWeight: 900, color: "white", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Built for Merchants,{" "}
              <span style={{ background: "linear-gradient(135deg,#E63946,#FF6B6B,#FF8C69)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Loved by Customers
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7, margin: "0 0 36px" }}>
              WishList Pro was born from a simple frustration — customers forgetting what they loved. We built the most powerful, beautiful wishlist solution for Shopify stores so your customers never lose track of what they want, and you never lose a sale.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="shimmer-btn">❤️ Start Free Trial</button>
              <button style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.18)", padding: "13px 28px", borderRadius: 11, fontWeight: 600, fontSize: 15, cursor: "pointer", backdropFilter: "blur(8px)", fontFamily: "inherit" }}>
                📖 View Docs
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 56 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-pill" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 36, marginBottom: 10, display: "inline-block", animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.4}s` }}>{s.icon}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#E63946", letterSpacing: "-1px", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MISSION ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 56, alignItems: "center" }}>
          <div style={{ animation: "fadeUp 0.5s ease 0.2s both" }}>
            <div className="section-label"><span>🎯</span> Our Mission</div>
            <h2 style={{ margin: "0 0 18px", fontSize: 32, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.8px", lineHeight: 1.2 }}>
              Turning Wishlists Into Revenue
            </h2>
            <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.8, margin: "0 0 16px" }}>
              We believe every "saved for later" is a sale waiting to happen. Our mission is to give Shopify merchants the tools to understand what customers want, and act on it at exactly the right moment.
            </p>
            <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
              From back-in-stock alerts to low-inventory nudges, WishList Pro transforms passive interest into active purchases — automatically.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { icon: "📧", title: "Smart Alerts", desc: "Auto-notify customers when wished items go on sale" },
              { icon: "📊", title: "Deep Analytics", desc: "Know exactly which products customers desire most" },
              { icon: "🎨", title: "Theme Native", desc: "Seamlessly blends with any Shopify theme" },
              { icon: "🚀", title: "One-Click Setup", desc: "Live in minutes, no developer needed" },
            ].map((f, i) => (
              <div key={i} style={{ background: "white", borderRadius: 16, padding: "20px 18px", border: "1.5px solid #EBEBEC", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", animation: `fadeUp 0.5s ease ${0.1 + i * 0.08}s both`, transition: "all 0.25s cubic-bezier(0.34,1.4,0.64,1)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#E63946"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#EBEBEC"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A2E", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VALUES ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="section-label" style={{ margin: "0 auto 14px" }}><span>💡</span> What We Stand For</div>
            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.8px" }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {values.map((v, i) => (
              <div key={i} className="value-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: "#FFF0F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 10 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TEAM ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="section-label" style={{ margin: "0 auto 14px" }}><span>👥</span> The People</div>
            <h2 style={{ margin: "0 0 10px", fontSize: 32, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.8px" }}>Meet the Team</h2>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 15 }}>A small, passionate team obsessed with your success</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {team.map((member, i) => (
              <div key={i} className="team-card" style={{ animationDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredTeam(i)}
                onMouseLeave={() => setHoveredTeam(null)}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${member.color},${member.color}88)`, borderRadius: "20px 20px 0 0" }} />
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${member.color},${member.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white", margin: "0 auto 14px", boxShadow: `0 6px 20px ${member.color}40`, transition: "transform 0.3s", transform: hoveredTeam === i ? "scale(1.1)" : "scale(1)" }}>{member.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E", marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: member.color, marginBottom: 12, background: `${member.color}12`, padding: "3px 10px", borderRadius: 20, display: "inline-block" }}>{member.role}</div>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7, margin: "0 0 16px" }}>{member.bio}</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {["💼", "🐦"].map((icon, j) => (
                    <div key={j} className="social-btn">{icon}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DEVELOPER CONTACT ── */}
        <div style={{ marginBottom: 56 }}>
          {/* Developer Profile Card */}
          <div style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 55%,#0F3460 100%)", borderRadius: 28, padding: "48px 52px", marginBottom: 28, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 260, height: 260, background: "radial-gradient(circle,rgba(230,57,70,0.18),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: "40%", width: 200, height: 200, background: "radial-gradient(circle,rgba(78,205,196,0.1),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 32, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#E63946,#FF8C69)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "white", boxShadow: "0 8px 32px rgba(230,57,70,0.4)", border: "3px solid rgba(255,255,255,0.15)" }}>AS</div>
                <div style={{ position: "absolute", bottom: 4, right: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="online-dot" />
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>Aryan Shah</h2>
                  <span style={{ background: "rgba(230,57,70,0.2)", color: "#FF8C69", border: "1px solid rgba(230,57,70,0.35)", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>FOUNDER & CEO</span>
                </div>
                <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, maxWidth: 480 }}>
                  Building WishList Pro from Ahmedabad, India. Passionate about helping Shopify merchants grow through smart tools. Available for partnerships, collaborations, and merchant support.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "Shopify Expert", icon: "🛍️" },
                    { label: "React Developer", icon: "⚛️" },
                    { label: "Open to Collab", icon: "🤝" },
                  ].map((tag, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                      {tag.icon} {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
                {[
                  { val: "5+ yrs", label: "Building Apps" },
                  { val: "12K+", label: "Merchants" },
                  { val: "2 hrs", label: "Avg Response" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#FF8C69", letterSpacing: "-0.5px" }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Links Grid */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="section-label" style={{ margin: "0 auto 10px" }}><span>📬</span> Developer Contacts</div>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>Reach out through any of these channels</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {devContacts.map((c, i) => (
              <a key={i} href={c.link} target="_blank" rel="noopener noreferrer" className="contact-card" style={{ animationDelay: `${i * 0.08}s` }}
                onMouseEnter={() => setHoveredContact(i)}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: `${c.color}12`, border: `1.5px solid ${c.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, transition: "all 0.25s", transform: hoveredContact === i ? "scale(1.1)" : "scale(1)" }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A2E", marginBottom: 2, transition: "color 0.2s", ...(hoveredContact === i ? { color: c.color } : {}) }}>{c.value}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{c.sub}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", borderRadius: 20, padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#E63946,#FF8C69)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(230,57,70,0.4)" }}>❤️</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "white" }}>WishList Pro</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>© 2024 WishList Pro. All rights reserved.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Privacy Policy", "Terms of Service", "Docs"].map((link, i) => (
              <div key={i} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "6px 14px", borderRadius: 8, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "transparent"; }}
              >{link}</div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Made with ❤️ in Ahmedabad, India</div>
        </div>
      </div>
    </div>
  );
}