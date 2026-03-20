import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useTodayAdminData } from "./hooks/todayAdminDataState";
import "./styled/wishlist.css";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/* ──────────────────────────────────────
   HELPER: format date → "2h ago" / "3 days ago"
────────────────────────────────────── */
function formatLastActive(date) {
  const now = new Date();
  const updated = new Date(date);

  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const updDay = new Date(updated.getFullYear(), updated.getMonth(), updated.getDate());

  const diffDays = Math.round((nowDay - updDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffMs = now - updated;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs >= 1) return `${diffHrs}h ago`;
    if (diffMins >= 1) return `${diffMins}m ago`;
    return "just now";
  }
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

/* ──────────────────────────────────────
   LOADER
────────────────────────────────────── */
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // ── 1. Shopify product types (paginated) ──
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const paginatedQuery = `#graphql
      query getProductTypes($cursor: String) {
        products(first: 250, after: $cursor) {
          edges {
            node {
              productType
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const response = await admin.graphql(paginatedQuery, {
      variables: { cursor },
    });

    const { data } = await response.json();
    const { edges, pageInfo } = data.products;

    allProducts.push(...edges.map((e) => e.node.productType));

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  // Count occurrences of each product type
  const productTypeCounts = allProducts.reduce((acc, type) => {
    const key = type || "Uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Generate unique random hex colors (no white/black)
  const generateColor = (usedColors) => {
    let color;
    do {
      const r = Math.floor(Math.random() * 186) + 40;
      const g = Math.floor(Math.random() * 186) + 40;
      const b = Math.floor(Math.random() * 186) + 40;

      if (r > 200 && g > 200 && b > 200) continue;
      if (r < 50 && g < 50 && b < 50) continue;

      color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    } while (usedColors.has(color));

    usedColors.add(color);
    return color;
  };

  const usedColors = new Set();

  const productTypes = Object.entries(productTypeCounts).map(([type, count]) => ({
    type,
    count,
    color: generateColor(usedColors),
  }));

  // ── 2. Customers from Prisma ──
  const customers = await prisma.customer.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // ── 3. Wishlist items from Prisma ──
  const wishlistItems = await prisma.wishlist.findMany({
    orderBy: { createdAt: "desc" },
  });

  // ── 4. Build customerId → wishlist items map ──
  const wishlistByCustomer = {};
  for (const item of wishlistItems) {
    const ids = Array.isArray(item.customerIds)
      ? item.customerIds
      : JSON.parse(item.customerIds ?? "[]");

    for (const cId of ids) {
      if (!wishlistByCustomer[cId]) wishlistByCustomer[cId] = [];
      wishlistByCustomer[cId].push(item);
    }
  }

  // ── 5. Avatar color palette (consistent, index-based) ──
  const AVATAR_COLORS = [
    "#E63946", "#4ECDC4", "#45B7D1", "#F4A261", "#BB8FCE",
    "#2ECC71", "#E67E22", "#E91E8C", "#3498DB", "#1ABC9C",
  ];

  // ── 6. Shape into UI-ready users array ──
  const users = customers.map((customer, idx) => {
    const items = wishlistByCustomer[customer.id] ?? [];
    const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

    return {
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      avatar: `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase(),
      avatarColor,
      totalItems: customer.wishlistItems,
      totalValue: customer.wishlistprice,
      lastActive: formatLastActive(customer.updatedAt),
      status: "active",
      wishlist: items.map((w) => ({
        name: w.productName,
        category: w.productcategory,
        price: parseFloat(w.productPrice),
        img: w.productImage?.startsWith("//") ? `https:${w.productImage}` : w.productImage,
        link: w.productLink,
        varientId: w.varientId,
        productId: w.productId,
        addedOn: formatLastActive(w.createdAt),
        inStock: w.instock,
      })),
    };
  });

  return Response.json({ productTypes, users });
};

/* ──────────────────────────────────────
   STATUS CONFIG
────────────────────────────────────── */
const statusColor = { active: "#10B981", idle: "#F59E0B", offline: "#9CA3AF" };
const statusBg = { active: "#ECFDF5", idle: "#FFFBEB", offline: "#F9FAFB" };
const statusBorder = { active: "rgba(16,185,129,0.3)", idle: "rgba(245,158,11,0.3)", offline: "rgba(156,163,175,0.3)" };
const statusTextColor = { active: "#059669", idle: "#D97706", offline: "#6B7280" };

const OOS_BAR_COLORS = ["#E63946", "#FF6B6B", "#FF8C69", "#E05050", "#FF4757", "#FF6348", "#E84393", "#E63946"];

/* ──────────────────────────────────────
   TOOLTIP COMPONENTS
────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="custom-tooltip__val" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.value > 999 ? `$${p.value.toLocaleString()}` : p.value}
        </div>
      ))}
    </div>
  );
};

const OosTooltip = ({ active, payload, label, oosOnly }) => {
  if (!active || !payload?.length) return null;
  const d = oosOnly.find(o => o.category === label);
  return (
    <div className="oos-tooltip">
      <div className="oos-tooltip__title">{label}</div>
      <div className="oos-tooltip__row">
        <span className="oos-tooltip__key">🚫 Out of Stock</span>
        <span className="oos-tooltip__val oos-tooltip__val--red">{d?.outOfStock}</span>
      </div>
      <div className="oos-tooltip__row">
        <span className="oos-tooltip__key">🛍️ Total in wishlist</span>
        <span className="oos-tooltip__val oos-tooltip__val--dark">{d?.total}</span>
      </div>
      <div className="oos-tooltip__divider">
        <div className="oos-tooltip__row">
          <span className="oos-tooltip__key">OOS Rate</span>
          <span className="oos-tooltip__rate-val">{d ? Math.round((d.outOfStock / d.total) * 100) : 0}%</span>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────── */
export default function WishlistDashboard() {

  const { todayAdminData, fetchTodayAdminData } = useTodayAdminData();

  // ── users + productTypes now come from loader (Prisma + Shopify) ──
  const { productTypes, users } = useLoaderData();

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAnim, setModalAnim] = useState(false);
  const [search, setSearch] = useState("");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 120);
    fetchTodayAdminData();
  }, []);

  const openModal = (user) => { setSelectedUser(user); setTimeout(() => setModalAnim(true), 10); };
  const closeModal = () => { setModalAnim(false); setTimeout(() => setSelectedUser(null), 280); };

  /* aggregates — computed from loader data */
  const totalItems = users.reduce((a, u) => a + u.totalItems, 0);
  const totalValue = users.reduce((a, u) => a + u.totalValue, 0);
  const totalProducts = users.reduce((a, u) => a + u.wishlist.length, 0);
  const activeUsers = users.filter(u => u.status === "active").length;

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* sidebar summary items */
  const summarySections = [
    { label: "Total Customers", value: todayAdminData.WholeData?.totalCustomers, icon: "👥", color: "#45B7D1", delay: "0s" },
    { label: "Wishlist Items", value: todayAdminData.WholeData?.totalCount, icon: "❤️", color: "#E63946", delay: "0.06s" },
    { label: "Unique Products", value: totalProducts, icon: "🛍️", color: "#F4A261", delay: "0.12s" },
    { label: "Total Value", value: "$" + todayAdminData.WholeData?.totalRevenue, icon: "💰", color: "#BB8FCE", delay: "0.18s" },
    { label: "Out of Stock", value: todayAdminData.WholeData?.OutOfStock, icon: "🚫", color: "#E63946", delay: "0.24s" },
  ];

  /* status rows */
  const statusRows = [
    { label: "Active", count: users.filter(u => u.status === "active").length, color: "#10B981", bg: "#ECFDF5", border: "#BBF7D0" },
    { label: "Idle", count: users.filter(u => u.status === "idle").length, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
    { label: "Offline", count: users.filter(u => u.status === "offline").length, color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB" },
  ];

  /* kpi cards */
  const kpiCards = [
    { label: "Today Total Wishlists", value: todayAdminData.todayTotalWishlist, sub: "↑ " + todayAdminData.todayincrementWishlist + "% today", icon: "❤️", color: "#E63946", delay: "0s" },
    { label: "Items Saved", value: totalItems, sub: "↑ 8% this week", icon: "🛍️", color: "#4ECDC4", delay: "0.08s" },
    { label: "Today Total Value", value: "$" + todayAdminData.todayTotalValue, sub: "↑ " + todayAdminData.todayTotalValueIncrement + "% today", icon: "💰", color: "#F4A261", delay: "0.16s" },
    { label: "Avg per User", value: todayAdminData.itemPerWishlist, sub: "items per wishlist", icon: "📊", color: "#BB8FCE", delay: "0.24s" },
  ];

  /* modal pills */
  const modalPills = selectedUser ? [
    { icon: "❤️", label: `${selectedUser.totalItems} items` },
    { icon: "💰", label: `$${Number(selectedUser.totalValue).toLocaleString()}` },
    { icon: "🕐", label: selectedUser.lastActive },
  ] : [];

  /* ── RENDER ── */
  return (
    <div id="app-root">
      {/* ── HEADER ── */}
      <header id="header">
        <div id="header-brand">
          <div id="header-logo">❤️</div>
          <span id="header-title">WishList Pro</span>
          <span className="badge-admin">ADMIN</span>
        </div>

        <div id="header-actions">
          <div className="active-now-pill">
            <div className="live-dot" />
            <span>{activeUsers} Active Now</span>
          </div>
          <button className="shimmer-btn shimmer-btn--lg">+ New Campaign</button>
        </div>
      </header>

      <div id="body-layout">

        {/* ── SIDEBAR ── */}
        <aside id="sidebar">

          {/* Summary */}
          <section>
            <div className="sidebar-section-label">Summary</div>
            {summarySections.map((s, i) => (
              <div
                key={i}
                className="sidebar-stat"
                style={{ animationDelay: s.delay }}
              >
                <div
                  className="sidebar-stat__icon"
                  style={{ background: `${s.color}15` }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="sidebar-stat__value">{s.value}</div>
                  <div className="sidebar-stat__label">{s.label}</div>
                </div>
              </div>
            ))}
          </section>

          {/* By Category */}
          <section>
            <div className="sidebar-section-label sidebar-section-label--mb14">By Category</div>
            {productTypes.map((cat, i) => (
              <div key={i} className="cat-bar-row">
                <div className="cat-bar-header">
                  <span className="cat-bar-name">{cat.type}</span>
                  <span className="cat-bar-pct" style={{ color: cat.color }}>{cat.count}%</span>
                </div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: animated ? `${cat.value}%` : "100%",
                      background: `linear-gradient(90deg,${cat.color}77,${cat.color})`,
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* User Status */}
          <section>
            <div className="sidebar-section-label">User Status</div>
            {statusRows.map((s, i) => (
              <div
                key={i}
                className="status-pill"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <div className="status-pill__left">
                  <div className="status-dot" style={{ background: s.color }} />
                  <span className="status-pill__label">{s.label}</span>
                </div>
                <span className="status-pill__count" style={{ color: s.color }}>{s.count}</span>
              </div>
            ))}
          </section>
        </aside>

        {/* ── MAIN ── */}
        <main id="main-content">

          {/* KPI Cards */}
          <div className="kpi-grid">
            {kpiCards.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: s.delay }}>
                <div
                  className="stat-card__glow"
                  style={{ background: `radial-gradient(circle,${s.color}18,transparent 70%)` }}
                />
                <div className="stat-card__top">
                  <div className="stat-card__icon" style={{ background: `${s.color}14` }}>{s.icon}</div>
                  <div className="stat-card__dot" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}99` }} />
                </div>
                <div className="stat-card__value">{s.value}</div>
                <div className="stat-card__label">{s.label}</div>
                <div className="stat-card__sub" style={{ color: s.color }}>
                  <span className="stat-card__sub-pill" style={{ background: `${s.color}12` }}>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Area + Pie charts */}
          <div className="charts-row">

            {/* Area chart */}
            <div className="graph-card" style={{ animationDelay: "0.3s" }}>
              <div className="chart-header">
                <div>
                  <div className="chart-title">Wishlist Activity</div>
                  <div className="chart-subtitle">Daily saves & value this week</div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#E63946" }} />
                    <span className="legend-label">Saves</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#4ECDC4" }} />
                    <span className="legend-label">Value</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={175}>
                <AreaChart data={todayAdminData.DailyAnalistresult}>
                  <defs>
                    <linearGradient id="gSaves" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="totalproduct" name="Saves" stroke="#E63946" strokeWidth={2.5} fill="url(#gSaves)" dot={false} />
                  <Area type="monotone" dataKey="revenue" name="Value $" stroke="#4ECDC4" strokeWidth={2.5} fill="url(#gValue)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="graph-card" style={{ animationDelay: "0.38s" }}>
              <div className="chart-title">By Category</div>
              <div className="chart-subtitle" style={{ marginBottom: 14 }}>Product distribution</div>
              <ResponsiveContainer width="100%" height={145}>
                <PieChart>
                  <Pie data={productTypes} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={3} dataKey="count">
                    {productTypes.map((c, i) => <Cell key={c.type} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, props.payload.type]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {productTypes.map((c, i) => (
                  <div key={i} className="pie-legend-item">
                    <div className="pie-legend-dot" style={{ background: c.color }} />
                    <span className="pie-legend-name">{c.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OOS Chart */}
          <div className="graph-card" style={{ animationDelay: "0.42s" }}>
            <div className="oos-header">
              <div>
                <div className="chart-title">Out of Stock — Category Wise</div>
                <div className="chart-subtitle">OOS count vs total wishlist items per category</div>
              </div>
              <div className="oos-badges">
                <div className="oos-badge oos-badge--red">🚫 {todayAdminData?.WholeData?.OutOfStock ?? 0} OOS in Wishlist</div>
                <div className="oos-badge oos-badge--gray">🛍️ {todayAdminData?.totalproducts ?? 0} total</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={todayAdminData.oosOnly2} barSize={42} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                <Tooltip content={(props) => <OosTooltip {...props} oosOnly={todayAdminData.oosOnly2} />} />
                <Bar
                  dataKey="outOfStock"
                  name="Out of Stock"
                  radius={[8, 8, 0, 0]}
                  label={({ x, y, width, value, index }) => {
                    const d = todayAdminData.oosOnly2[index];
                    return (
                      <g>
                        <text x={x + width / 2} y={y - 6} textAnchor="middle" fill="#E63946" fontWeight={800} fontSize={13}>🚫 {value}</text>
                        <text x={x + width / 2} y={y + (230 - 24 - 30) + 38} textAnchor="middle" fill="#6B7280" fontWeight={700} fontSize={11}>{d?.total} total</text>
                      </g>
                    );
                  }}
                >
                  {todayAdminData?.oosOnly2?.map((_, i) => (
                    <Cell
                      key={i}
                      fill={OOS_BAR_COLORS[i % OOS_BAR_COLORS.length]}
                      fillOpacity={0.88}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="oos-pills-row">
              {todayAdminData?.oosOnly2?.map((c, i) => (
                <div key={i} className="oos-pill">
                  <div
                    className="oos-pill__dot"
                    style={{ background: OOS_BAR_COLORS[i % OOS_BAR_COLORS.length] }}
                  />
                  <span className="oos-pill__cat">{c.category}</span>
                  <span className="oos-pill__oos">{c.outOfStock} OOS</span>
                  <span className="oos-pill__sep">/</span>
                  <span className="oos-pill__total">{c.total} total</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Growth Bar */}
          <div className="graph-card" style={{ animationDelay: "0.44s" }}>
            <div className="chart-header">
              <div>
                <div className="chart-title">Monthly Wishlist Growth</div>
                <div className="chart-subtitle">Total wishlists created per month</div>
              </div>
              <div className="monthly-badge">+{todayAdminData?.currentMonthWishlists} ↑</div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={todayAdminData?.barData} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="wishlists" name="Wishlists" radius={[7, 7, 0, 0]}>
                  {todayAdminData?.barData?.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === todayAdminData?.barData?.length - 1
                        ? "#E63946"
                        : `#E63946${Math.round(30 + i * 28).toString(16).padStart(2, "0")}`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Table */}
          <div id="customer-table">
            <div id="customer-table-header">
              <div>
                <div className="table-title">Customer Wishlists</div>
                <div className="table-subtitle">Click any row to view full wishlist</div>
              </div>
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div id="user-list">
              {filtered.map((user, i) => (
                <div
                  key={user.id}
                  className="user-row"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => openModal(user)}
                >
                  <div
                    className="user-row__avatar"
                    style={{
                      background: `linear-gradient(135deg,${user.avatarColor},${user.avatarColor}99)`,
                      boxShadow: `0 3px 10px ${user.avatarColor}40`,
                    }}
                  >
                    {user.avatar}
                  </div>

                  <div className="user-row__info">
                    <div className="user-row__name">{user.name}</div>
                    <div className="user-row__email">{user.email}</div>
                  </div>

                  <div className="user-row__status">
                    <div
                      className="status-chip"
                      style={{
                        background: statusBg[user.status],
                        border: `1px solid ${statusBorder[user.status]}`,
                      }}
                    >
                      <div className="status-chip__dot" style={{ background: statusColor[user.status] }} />
                      <span className="status-chip__text" style={{ color: statusTextColor[user.status] }}>
                        {user.status}
                      </span>
                    </div>
                  </div>

                  <div className="user-row__counts">
                    <div className="user-row__items">{user.totalItems} items</div>
                    <div className="user-row__value">${Number(user.totalValue).toLocaleString()}</div>
                  </div>

                  <div className="user-row__time">{user.lastActive}</div>
                  <div className="row-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL ── */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-box"
            style={{
              opacity: modalAnim ? 1 : 0,
              transform: modalAnim ? "scale(1) translateY(0)" : "scale(0.94) translateY(16px)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="modal-header"
              style={{
                background: `linear-gradient(135deg,${selectedUser.avatarColor}ee,${selectedUser.avatarColor}99)`,
              }}
            >
              <div className="modal-header__decor" />
              <div className="modal-header__inner">
                <div className="modal-header__top">
                  <div className="modal-header__user">
                    <div className="modal-avatar">{selectedUser.avatar}</div>
                    <div>
                      <div className="modal-user-name">{selectedUser.name}</div>
                      <div className="modal-user-email">{selectedUser.email}</div>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>✕</button>
                </div>

                <div className="modal-header__pills">
                  {modalPills.map((p, i) => (
                    <div key={i} className="modal-pill">
                      <span>{p.icon}</span>{p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="modal-body">
              <div className="modal-body__header">
                <div className="modal-body__title">
                  Saved Products
                  <span className="badge-count">{selectedUser.wishlist.length}</span>
                </div>
                <button className="shimmer-btn">📧 Notify</button>
              </div>

              {selectedUser.wishlist.map((item, i) => (
                <div key={i} className="product-row">
                  <div className="product-row__img">
                    {item.img && item.img.startsWith("http") ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
                        onError={e => { e.target.style.display = "none"; e.target.parentNode.innerText = "🛍️"; }}
                      />
                    ) : (
                      item.img || "🛍️"
                    )}
                  </div>
                  <div className="product-row__info">
                    <div className="product-row__name">{item.name}</div>
                    <div className="product-row__meta">
                      <span className="tag-category">{item.category}</span>
                      <span className="product-row__added">Added {item.addedOn}</span>
                    </div>
                  </div>
                  <div className="product-row__price-col">
                    <div className="product-row__price">${item.price}</div>
                    <span className={`stock-badge ${item.inStock ? "stock-badge--in" : "stock-badge--out"}`}>
                      {item.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="modal-footer">
              <button className="plain-btn" onClick={closeModal}>Close</button>
              <button className="shimmer-btn">🛒 Send Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}