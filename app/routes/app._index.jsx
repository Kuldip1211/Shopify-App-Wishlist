import { useState, useEffect } from "react";
import "./styled/index.css";
import { useLoaderData, Form, useActionData } from "react-router";
import db from "../db.server";
import { authenticate } from "../shopify.server";
import { useCustomerCount } from "./hooks/useCustomerCount";
import { useActiveCustomerCount } from "./hooks/useActiveCustomerCount";
import {useCustomerList} from "./hooks/customerListState"
import { useMostListedProducts } from "./hooks/mostlistedproduct";


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // Shopify total product count
  const response = await admin.graphql(`
    query {
      productsCount {
        count
      }
    }
  `);
  const data = await response.json();
  const totalProducts = data.data.productsCount.count;

  // Total wishlist count (all time)
  const result = await db.products.aggregate({
    _sum: {
      productlistCount: true,
    },
  });

  // Today's wishlist count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayResult = await db.products.aggregate({
    _sum: {
      productlistCount: true,
    },
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const totalCount    = result._sum.productlistCount      ?? 0;
  const todayCount    = todayResult._sum.productlistCount ?? 0;

  return Response.json({ totalProducts, totalCount, todayCount });
};


/* ──────────────────────────────────────
   DATA
────────────────────────────────────── */
const topProducts = [
  { name: "Premium Leather Bag", saves: 342, img: "👜", category: "Accessories" },
  { name: "Wireless Headphones", saves: 289, img: "🎧", category: "Electronics" },
  { name: "Running Sneakers",    saves: 201, img: "👟", category: "Footwear"     },
  { name: "Silk Scarf",          saves: 178, img: "🧣", category: "Fashion"      },
];



const quickActions = [
  { icon: "🎨", label: "Customize Wishlist Button", desc: "Theme & placement" },
  { icon: "📧", label: "Send Wishlist Reminders",   desc: "Email campaigns"   },
  { icon: "📊", label: "Export Wishlist Data",      desc: "CSV / Analytics"   },
];

/* ──────────────────────────────────────
   COMPONENT
────────────────────────────────────── */
export default function Index() {

  const { count, loading, error } = useCustomerCount()
  const { activeCount, activeloading , activeerror } = useActiveCustomerCount()
  const { totalCount , todayCount, totalProducts } = useLoaderData()
  const { recentWishlists, fetchCustomerList } = useCustomerList()  
  const {   mostListedProducts , fetchMostListedProducts} = useMostListedProducts() 
  
  const stats = [
    { label: "Total Wishlists",  value: totalCount,  icon: "❤️", trend: "+" + todayCount , color: "#FF6B6B" },
    { label: "Products Saved",   value: totalProducts, icon: "🛍️", trend: "",  color: "#4ECDC4" },
    { label: "Total Users",     value: count,  icon: "👥", trend: "Active: "+activeCount, color: "#45B7D1" },
    { label: "Conversion Rate",  value: "34.2%",  icon: "📈", trend: "+5%",  color: "#96CEB4" },
  ];

  const miniStats = [
    { label: "Today's saves", value: "+" + todayCount, color: "#4ECDC4" },
    { label: "Active now",    value: activeCount,   color: "#96CEB4" },
    { label: "Conversions",   value: "8",    color: "#FF6B6B" },
  ];
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
    fetchCustomerList(); // ✅ actually fetch the data on mount
    fetchMostListedProducts()
  }, []);


  return (
    <div id="page-root">
      <div id="page-inner">

        {/* ── HERO ── */}
        <section id="hero" className={animate ? "visible" : "hidden"}>
          <div id="hero-blob-top" />
          <div id="hero-blob-bottom" />

          {/* Brand */}
          <div id="hero-brand">
            <div id="hero-logo">❤️</div>
            <span id="hero-brand-name">WishList Pro</span>
          </div>

          {/* Content */}
          <div id="hero-content">
            <div className="hero-badge">
              <span>●</span> Live Dashboard
            </div>
            <h1 id="hero-title">
              Welcome to Your{" "}
              <span className="gradient-text">Wishlist Hub</span>
            </h1>
            <p id="hero-desc">
              Track customer wishlists, discover trending products, and turn saved items into sales.
              Your customers are telling you exactly what they want.
            </p>
            <div id="hero-actions">
              <button className="shimmer-btn shimmer-btn--lg">📊 View All Wishlists</button>
              <button className="ghost-btn">🎨 Customize Widget</button>
            </div>
          </div>

          {/* Floating mini-stats */}
          <div id="hero-mini-stats">
            {miniStats.map((item, i) => (
              <div
                key={i}
                className="mini-stat"
                style={{ animationDelay: `${0.8 + i * 0.15}s` }}
              >
                <div className="mini-stat__value" style={{ color: item.color }}>{item.value}</div>
                <div className="mini-stat__label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS GRID ── */}
        <div id="stats-grid">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                "--accent": stat.color,
                animationDelay: `${0.1 + i * 0.1}s`,
              }}
            >
              <div className="stat-card__top">
                <div
                  className="stat-card__icon"
                  style={{ background: `${stat.color}15` }}
                >
                  {stat.icon}
                </div>
                <span className="trend-badge">{stat.trend}</span>
              </div>
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: animate ? `${60 + i * 10}%` : "0%",
                    background: `linear-gradient(90deg, ${stat.color}80, ${stat.color})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── TWO-COLUMN ROW ── */}
        <div id="two-col">

          {/* Recent Wishlists */}
          <div id="wishlists-card" className="section-card">
            <div className="card-header">
              <div>
                <h3 className="card-header__title">Recent Customer Wishlists</h3>
                <p className="card-header__sub">Customers actively saving products</p>
              </div>
              <button className="view-all-btn">View All →</button>
            </div>

            <div id="user-rows">
              {(recentWishlists.customers || []).map((user, i) => (  // ✅ || [] fallback
                <div key={i} className="user-row">
                  <div className="avatar" style={{ background: user.color }}>{user.avatar}</div>
                  <div className="user-row__info">
                    <div className="user-row__name">{user.user}</div>
                    <div className="user-row__email">{user.email}</div>
                  </div>
                  <div className="user-row__counts">
                    <div className="user-row__items">{user.products} items</div>
                    <div className="user-row__time">{user.lastActive}</div>
                  </div>
                  <div className="user-row__arrow">→</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div id="right-col">

            {/* Top Products */}
            <div id="products-card" className="section-card">
              <div className="products-card-header">
                <h3 className="products-card-header__title">🔥 Top Wished Products</h3>
                <span className="products-card-header__sub">This month</span>
              </div>
              <div id="product-list">
                {mostListedProducts.map((product, i) => (
                  <div key={i} className="product-item">
                    <div className="product-item__img">
                      <img
                        src={`https:${product.productImage}`} 
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="product-item__info">
                      <div className="product-item__name">{product.productName}</div>       {/* ✅ was product.name */}
                      <div className="product-item__cat">{product.productcategory}</div>    {/* ✅ was product.category */}
                    </div>
                    <div className="saves-badge">♥ {product.totalListed}</div>              {/* ✅ was product.saves */}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div id="actions-card" className="section-card">
              <h3>⚡ Quick Actions</h3>
              <div id="action-list">
                {quickActions.map((action, i) => (
                  <div key={i} className="action-item">
                    <span className="action-item__icon">{action.icon}</span>
                    <div>
                      <div className="action-item__label">{action.label}</div>
                      <div className="action-item__desc">{action.desc}</div>
                    </div>
                    <span className="action-item__arrow">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER BANNER ── */}
        <div id="footer-banner">
          <div id="footer-banner__left">
            <span id="footer-banner__emoji">🚀</span>
            <div>
              <div id="footer-banner__title">Theme Extension is Active</div>
              <div id="footer-banner__sub">
                Your wishlist button is live on your storefront. Customers can start saving products now.
              </div>
            </div>
          </div>
          <div id="footer-banner__actions">
            <button className="plain-btn">Preview Store →</button>
            <button className="shimmer-btn shimmer-btn--sm">Configure Extension</button>
          </div>
        </div>

      </div>
    </div>
  );
}