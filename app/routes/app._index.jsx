import { useState, useEffect } from "react";

const stats = [
  { label: "Total Wishlists", value: "2,847", icon: "❤️", trend: "+12%", color: "#FF6B6B" },
  { label: "Products Saved", value: "18,392", icon: "🛍️", trend: "+8%", color: "#4ECDC4" },
  { label: "Active Users", value: "1,203", icon: "👥", trend: "+24%", color: "#45B7D1" },
  { label: "Conversion Rate", value: "34.2%", icon: "📈", trend: "+5%", color: "#96CEB4" },
];

const recentWishlists = [
  { user: "Sarah M.", email: "sarah@email.com", products: 12, avatar: "SM", lastActive: "2m ago", color: "#FF6B6B" },
  { user: "James K.", email: "james@email.com", products: 7, avatar: "JK", lastActive: "15m ago", color: "#4ECDC4" },
  { user: "Priya L.", email: "priya@email.com", products: 23, avatar: "PL", lastActive: "1h ago", color: "#45B7D1" },
  { user: "Omar T.", email: "omar@email.com", products: 5, avatar: "OT", lastActive: "3h ago", color: "#F7DC6F" },
  { user: "Chen W.", email: "chen@email.com", products: 18, avatar: "CW", lastActive: "5h ago", color: "#BB8FCE" },
];

const topProducts = [
  { name: "Premium Leather Bag", saves: 342, img: "👜", category: "Accessories" },
  { name: "Wireless Headphones", saves: 289, img: "🎧", category: "Electronics" },
  { name: "Running Sneakers", saves: 201, img: "👟", category: "Footwear" },
  { name: "Silk Scarf", saves: 178, img: "🧣", category: "Fashion" },
];

export default function Index() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F6F6F7", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .stat-card:hover::before { transform: scaleX(1); }
        .user-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #F1F1F1;
        }
        .user-row:last-child { border-bottom: none; }
        .user-row:hover { background: #F9FAFB; }
        .product-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .product-item:hover { background: #F6F6F7; transform: translateX(4px); }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #FF6B6B15, #FF6B6B25);
          color: #E63946;
          border: 1px solid #FF6B6B30;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .gradient-text {
          background: linear-gradient(135deg, #E63946, #FF6B6B, #FF8C69);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .progress-bar {
          height: 6px;
          background: #F0F0F0;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .shimmer-btn {
          background: linear-gradient(270deg, #E63946, #FF6B6B, #FF8C69, #FF6B6B, #E63946);
          background-size: 300% 100%;
          animation: shimmer 3s ease infinite;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(230,57,70,0.35);
        }
        .shimmer-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(230,57,70,0.45);
        }
        .section-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .trend-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
          background: #ECFDF5;
          color: #059669;
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>

        {/* Hero Section */}
        <div style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
          borderRadius: 24,
          padding: "48px 56px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          {/* Background decorations */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 300, height: 300,
            background: "radial-gradient(circle, rgba(230,57,70,0.2) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute", bottom: -80, left: "30%",
            width: 200, height: 200,
            background: "radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />

          {/* App logo + name top-left */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 28, position: "relative", zIndex: 1
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 12px rgba(230,57,70,0.4)"
            }}>❤️</div>
            <span style={{
              fontWeight: 800, fontSize: 18, color: "white",
              letterSpacing: "-0.3px", opacity: 0.95
            }}>WishList Pro</span>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-badge" style={{ marginBottom: 20 }}>
              <span>●</span> Live Dashboard
            </div>
            <h1 style={{
              margin: "0 0 12px",
              fontSize: 42,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
              lineHeight: 1.1
            }}>
              Welcome to Your{" "}
              <span className="gradient-text">Wishlist Hub</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.65)", fontSize: 17,
              margin: "0 0 32px", maxWidth: 520, lineHeight: 1.6
            }}>
              Track customer wishlists, discover trending products, and turn saved items into sales.
              Your customers are telling you exactly what they want.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button className="shimmer-btn" style={{ fontSize: 15, padding: "14px 32px" }}>
                📊 View All Wishlists
              </button>
              <button style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "14px 28px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s"
              }}>
                🎨 Customize Widget
              </button>
            </div>
          </div>

          {/* Floating mini stats */}
          <div style={{
            position: "absolute", right: 56, top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 12
          }}>
            {[
              { label: "Today's saves", value: "+127", color: "#4ECDC4" },
              { label: "Active now", value: "43", color: "#96CEB4" },
              { label: "Conversions", value: "8", color: "#FF6B6B" }
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "12px 18px",
                textAlign: "center",
                animation: `fadeIn 0.5s ease ${0.8 + i * 0.15}s both`
              }}>
                <div style={{ color: item.color, fontSize: 22, fontWeight: 800 }}>{item.value}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{
              "--accent": stat.color,
              animation: `fadeSlideUp 0.5s ease ${0.1 + i * 0.1}s both`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${stat.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                }}>{stat.icon}</div>
                <span className="trend-badge">{stat.trend}</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-1px" }}>{stat.value}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4 }}>{stat.label}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: animate ? `${60 + i * 10}%` : "0%",
                  background: `linear-gradient(90deg, ${stat.color}80, ${stat.color})`
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Two Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 32 }}>

          {/* Recent Customer Wishlists */}
          <div className="section-card" style={{ animation: "fadeSlideUp 0.5s ease 0.5s both" }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #F1F1F1",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>Recent Customer Wishlists</h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Customers actively saving products</p>
              </div>
              <button style={{
                background: "#F6F6F7", border: "none", borderRadius: 8,
                padding: "6px 14px", fontSize: 13, color: "#374151", cursor: "pointer", fontWeight: 500
              }}>View All →</button>
            </div>
            <div style={{ padding: "8px 0" }}>
              {recentWishlists.map((user, i) => (
                <div key={i} className="user-row">
                  <div className="avatar" style={{ background: user.color }}>{user.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A2E" }}>{user.user}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{user.email}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{user.products} items</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{user.lastActive}</div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#F6F6F7", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 12, cursor: "pointer", color: "#6B7280"
                  }}>→</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="section-card" style={{ animation: "fadeSlideUp 0.5s ease 0.6s both" }}>
              <div style={{
                padding: "20px 20px 12px", borderBottom: "1px solid #F1F1F1",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>🔥 Top Wished Products</h3>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>This month</span>
              </div>
              <div style={{ padding: "8px 4px" }}>
                {topProducts.map((product, i) => (
                  <div key={i} className="product-item">
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "#F6F6F7", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 22
                    }}>{product.img}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A2E" }}>{product.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{product.category}</div>
                    </div>
                    <div style={{
                      background: "#FFF0F0", color: "#E63946",
                      padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700
                    }}>♥ {product.saves}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-card" style={{ padding: "20px", animation: "fadeSlideUp 0.5s ease 0.7s both" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>⚡ Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🎨", label: "Customize Wishlist Button", desc: "Theme & placement" },
                  { icon: "📧", label: "Send Wishlist Reminders", desc: "Email campaigns" },
                  { icon: "📊", label: "Export Wishlist Data", desc: "CSV / Analytics" },
                ].map((action, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10,
                    border: "1px solid #F1F1F1", cursor: "pointer",
                    transition: "all 0.2s", background: "white"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B6B60"; e.currentTarget.style.background = "#FFF5F5"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#F1F1F1"; e.currentTarget.style.background = "white"; }}
                  >
                    <span style={{ fontSize: 20 }}>{action.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A2E" }}>{action.label}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{action.desc}</div>
                    </div>
                    <span style={{ marginLeft: "auto", color: "#9CA3AF", fontSize: 14 }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Banner */}
        <div style={{
          background: "linear-gradient(135deg, #FF6B6B08, #4ECDC408)",
          border: "1px dashed rgba(230,57,70,0.25)",
          borderRadius: 16, padding: "24px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          animation: "fadeSlideUp 0.5s ease 0.8s both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>🚀</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1A2E" }}>Theme Extension is Active</div>
              <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 2 }}>
                Your wishlist button is live on your storefront. Customers can start saving products now.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              background: "white", border: "1px solid #E8E8E8",
              borderRadius: 8, padding: "10px 20px",
              fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151"
            }}>Preview Store →</button>
            <button className="shimmer-btn" style={{ fontSize: 13, padding: "10px 20px" }}>
              Configure Extension
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}