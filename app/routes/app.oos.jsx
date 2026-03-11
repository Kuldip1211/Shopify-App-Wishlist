import { useState } from "react";
import {
  AppProvider,
  Page,
  Modal,
  Badge,
  Thumbnail,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const categoriesData = [
  {
    id: 1,
    name: "T-Shirts",
    icon: "👕",
    total: 48,
    outOfStock: 7,
    wishlistCount: 143,
    products: [
      { id: 101, name: "Classic White Tee", sku: "TSH-001", price: "$19.99", wishlist: 38, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 102, name: "Graphic Print Tee – Urban", sku: "TSH-002", price: "$24.99", wishlist: 21, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 103, name: "Striped Polo Tee", sku: "TSH-003", price: "$29.99", wishlist: 14, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 104, name: "Oversized Drop Shoulder", sku: "TSH-004", price: "$34.99", wishlist: 29, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 105, name: "V-Neck Essential", sku: "TSH-005", price: "$22.99", wishlist: 17, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 106, name: "Tie-Dye Festival Tee", sku: "TSH-006", price: "$27.99", wishlist: 11, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 107, name: "Henley Long Sleeve", sku: "TSH-007", price: "$31.99", wishlist: 13, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
    ],
  },
  {
    id: 2,
    name: "Sneakers",
    icon: "👟",
    total: 62,
    outOfStock: 12,
    wishlistCount: 512,
    products: [
      { id: 201, name: "Air Bounce Low", sku: "SNK-001", price: "$89.99", wishlist: 74, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 202, name: "Runner Pro X2", sku: "SNK-002", price: "$119.99", wishlist: 91, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 203, name: "Canvas High-Top", sku: "SNK-003", price: "$74.99", wishlist: 33, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 204, name: "Trail Hiker Lite", sku: "SNK-004", price: "$134.99", wishlist: 58, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 205, name: "Court Classic White", sku: "SNK-005", price: "$99.99", wishlist: 47, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 206, name: "Slip-On Wave", sku: "SNK-006", price: "$64.99", wishlist: 29, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 207, name: "Boost Cushion Run", sku: "SNK-007", price: "$149.99", wishlist: 62, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 208, name: "Retro Skate Low", sku: "SNK-008", price: "$84.99", wishlist: 41, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 209, name: "Mesh Sprint V3", sku: "SNK-009", price: "$109.99", wishlist: 38, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 210, name: "Chunky Dad Sneaker", sku: "SNK-010", price: "$129.99", wishlist: 19, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 211, name: "Neon Racer Edition", sku: "SNK-011", price: "$159.99", wishlist: 11, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 212, name: "Minimalist Knit", sku: "SNK-012", price: "$94.99", wishlist: 9, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
    ],
  },
  {
    id: 3,
    name: "Jackets",
    icon: "🧥",
    total: 35,
    outOfStock: 4,
    wishlistCount: 89,
    products: [
      { id: 301, name: "Puffer Jacket – Black", sku: "JKT-001", price: "$149.99", wishlist: 42, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
      { id: 302, name: "Denim Trucker Jacket", sku: "JKT-002", price: "$89.99", wishlist: 27, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
      { id: 303, name: "Windbreaker Slim Fit", sku: "JKT-003", price: "$109.99", wishlist: 13, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
      { id: 304, name: "Sherpa Fleece Jacket", sku: "JKT-004", price: "$129.99", wishlist: 7, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
    ],
  },
  {
    id: 4,
    name: "Accessories",
    icon: "🎒",
    total: 91,
    outOfStock: 18,
    wishlistCount: 334,
    products: [
      { id: 401, name: "Canvas Tote Bag", sku: "ACC-001", price: "$29.99", wishlist: 44, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 402, name: "Leather Belt – Brown", sku: "ACC-002", price: "$44.99", wishlist: 18, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 403, name: "Snapback Cap – Logo", sku: "ACC-003", price: "$24.99", wishlist: 31, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 404, name: "Woven Sling Bag", sku: "ACC-004", price: "$54.99", wishlist: 22, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 405, name: "Wool Beanie – Winter", sku: "ACC-005", price: "$19.99", wishlist: 15, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 406, name: "Sunglasses – Polarized", sku: "ACC-006", price: "$69.99", wishlist: 39, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 407, name: "Watch – Minimalist", sku: "ACC-007", price: "$199.99", wishlist: 67, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 408, name: "Scarves – Plaid Print", sku: "ACC-008", price: "$34.99", wishlist: 9, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 409, name: "Leather Wallet – Slim", sku: "ACC-009", price: "$49.99", wishlist: 28, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 410, name: "Phone Case – Clear", sku: "ACC-010", price: "$14.99", wishlist: 12, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 411, name: "Keychain – Metal Engraved", sku: "ACC-011", price: "$9.99", wishlist: 6, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 412, name: "Bandana – Paisley", sku: "ACC-012", price: "$12.99", wishlist: 4, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 413, name: "Laptop Sleeve 15\"", sku: "ACC-013", price: "$39.99", wishlist: 11, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 414, name: "Passport Holder", sku: "ACC-014", price: "$22.99", wishlist: 8, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 415, name: "Gym Duffel – Black", sku: "ACC-015", price: "$79.99", wishlist: 5, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 416, name: "Hair Clip Set", sku: "ACC-016", price: "$8.99", wishlist: 3, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 417, name: "Jewelry Box – Travel", sku: "ACC-017", price: "$29.99", wishlist: 7, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 418, name: "Sports Armband", sku: "ACC-018", price: "$17.99", wishlist: 5, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
    ],
  },
  {
    id: 5,
    name: "Pants & Denim",
    icon: "👖",
    total: 44,
    outOfStock: 9,
    wishlistCount: 207,
    products: [
      { id: 501, name: "Slim Fit Chinos – Navy", sku: "PNT-001", price: "$59.99", wishlist: 36, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 502, name: "Relaxed Joggers", sku: "PNT-002", price: "$49.99", wishlist: 28, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 503, name: "Skinny Jeans – Black", sku: "PNT-003", price: "$69.99", wishlist: 41, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 504, name: "Wide Leg Denim", sku: "PNT-004", price: "$79.99", wishlist: 19, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 505, name: "Cargo Pants – Olive", sku: "PNT-005", price: "$74.99", wishlist: 33, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 506, name: "Linen Trousers", sku: "PNT-006", price: "$64.99", wishlist: 15, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 507, name: "Pleated Dress Pants", sku: "PNT-007", price: "$89.99", wishlist: 12, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 508, name: "Ripped Skinny Jeans", sku: "PNT-008", price: "$72.99", wishlist: 14, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 509, name: "Track Pants – Striped", sku: "PNT-009", price: "$44.99", wishlist: 9, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
    ],
  },
];

// ── Injected Styles ───────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --oos-bg: #f5f3ef;
    --oos-surface: #ffffff;
    --oos-ink: #111827;
    --oos-muted: #6b7280;
    --oos-accent: #e63946;
    --oos-accent-soft: #fde8ea;
    --oos-amber: #f59e0b;
    --oos-amber-soft: #fef3c7;
    --oos-green: #10b981;
    --oos-green-soft: #d1fae5;
    --oos-border: #e5e1da;
    --oos-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    --oos-shadow-hover: 0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08);
    --oos-radius: 14px;
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Plus Jakarta Sans', sans-serif;
  }

  .oos-root * { box-sizing: border-box; }
  .oos-root { font-family: var(--font-body); background: var(--oos-bg); min-height: 100vh; }

  /* ── Page Header ── */
  .oos-header {
    padding: 32px 0 8px;
    animation: oos-fadeDown 0.5s ease both;
  }
  .oos-header h1 {
    font-family: var(--font-display);
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--oos-ink);
    margin: 0 0 4px;
  }
  .oos-header p { color: var(--oos-muted); font-size: 0.9rem; margin: 0; }

  /* ── Summary Strip ── */
  .oos-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    margin-bottom: 24px;
    animation: oos-fadeUp 0.55s 0.1s ease both;
  }
  .oos-stat {
    background: var(--oos-surface);
    border: 1px solid var(--oos-border);
    border-radius: var(--oos-radius);
    padding: 18px 20px;
    box-shadow: var(--oos-shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .oos-stat:hover { transform: translateY(-2px); box-shadow: var(--oos-shadow-hover); }
  .oos-stat__label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--oos-muted); margin-bottom: 6px; }
  .oos-stat__val { font-family: var(--font-body); font-size: 1.75rem; font-weight: 800; color: var(--oos-ink); line-height: 1; }
  .oos-stat--alert .oos-stat__val { color: var(--oos-accent); }
  .oos-stat__dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
  .oos-stat__dot--red { background: var(--oos-accent); }
  .oos-stat__dot--amber { background: var(--oos-amber); }

  /* ── Custom Banner ── */
  .oos-banner-wrap { margin-bottom: 20px; animation: oos-fadeUp 0.55s 0.15s ease both; }
  .oos-custom-banner {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: #fffbeb;
    border: 1.5px solid #fcd34d;
    border-left: 4px solid var(--oos-amber);
    border-radius: var(--oos-radius);
    padding: 16px 20px;
  }
  .oos-custom-banner__icon {
    width: 36px; height: 36px;
    background: #fef3c7;
    border: 1px solid #fcd34d;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .oos-custom-banner__body { flex: 1; min-width: 0; }
  .oos-custom-banner__title {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 700;
    color: #92400e;
    margin: 0 0 3px;
  }
  .oos-custom-banner__desc {
    font-size: 0.82rem;
    color: #b45309;
    margin: 0;
    line-height: 1.5;
  }
  .oos-custom-banner__badge {
    display: inline-flex;
    align-items: center;
    background: #fef3c7;
    border: 1px solid #fcd34d;
    color: #92400e;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: center;
  }

  /* ── Table Card ── */
  .oos-card-wrap {
    background: var(--oos-surface);
    border: 1px solid var(--oos-border);
    border-radius: var(--oos-radius);
    box-shadow: var(--oos-shadow);
    overflow: hidden;
    animation: oos-fadeUp 0.6s 0.2s ease both;
  }
  .oos-card-title {
    padding: 18px 24px 16px;
    border-bottom: 1px solid var(--oos-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .oos-card-title h2 {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--oos-ink);
    margin: 0;
  }
  .oos-total-pill {
    background: var(--oos-accent-soft);
    color: var(--oos-accent);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.02em;
  }

  /* ── Category Row ── */
  .oos-table { width: 100%; border-collapse: collapse; }
  .oos-table th {
    text-align: left;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--oos-muted);
    padding: 10px 24px;
    background: #faf9f7;
    border-bottom: 1px solid var(--oos-border);
  }
  .oos-table th:last-child { text-align: right; }
  .oos-table td { padding: 14px 24px; border-bottom: 1px solid var(--oos-border); vertical-align: middle; }
  .oos-table tr:last-child td { border-bottom: none; }
  .oos-table tbody tr {
    transition: background 0.15s;
    cursor: pointer;
  }
  .oos-table tbody tr:hover { background: #faf9f7; }
  .oos-table tbody tr:hover .oos-row-arrow { transform: translateX(4px); }

  .oos-cat-cell { display: flex; align-items: center; gap: 12px; }
  .oos-cat-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--oos-bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
    border: 1px solid var(--oos-border);
  }
  .oos-cat-name { font-weight: 600; color: var(--oos-ink); font-size: 0.9rem; }
  .oos-cat-sub { font-size: 0.75rem; color: var(--oos-muted); }

  /* Progress Bar */
  .oos-progress-wrap { width: 100%; max-width: 180px; }
  .oos-progress-bar-bg {
    height: 6px; border-radius: 99px;
    background: var(--oos-border);
    overflow: hidden;
  }
  .oos-progress-bar-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--oos-accent), #ff6b6b);
    transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
  }
  .oos-progress-label {
    font-size: 0.7rem; color: var(--oos-muted); margin-top: 4px;
    display: flex; justify-content: space-between;
  }

  .oos-count-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--font-body);
    font-weight: 700; font-size: 1.05rem;
    color: var(--oos-accent);
  }
  .oos-count-total { color: var(--oos-muted); font-size: 0.78rem; font-weight: 400; }

  .oos-row-action {
    display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  }
  .oos-row-arrow {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--oos-bg); border: 1px solid var(--oos-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--oos-muted);
    transition: transform 0.2s;
    font-size: 0.8rem;
  }

  /* ── Severity Badge ── */
  .oos-sev {
    display: inline-block;
    font-size: 0.65rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    padding: 3px 8px; border-radius: 99px;
  }
  .oos-sev--high { background: var(--oos-accent-soft); color: var(--oos-accent); }
  .oos-sev--medium { background: var(--oos-amber-soft); color: #92400e; }
  .oos-sev--low { background: var(--oos-green-soft); color: #065f46; }

  /* ── Wishlist Column ── */
  .oos-wishlist-cell {
    display: flex; align-items: center; gap: 8px;
  }
  .oos-wishlist-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: #fff0f3; border: 1px solid #fecdd3;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; flex-shrink: 0;
  }
  .oos-wishlist-count {
    font-weight: 700; color: #be123c; font-size: 0.95rem;
  }
  .oos-wishlist-label {
    font-size: 0.72rem; color: var(--oos-muted);
  }

  /* ── Modal Overlay ── */
  .oos-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(3px);
    z-index: 9998;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: oos-fadeIn 0.2s ease both;
  }
  .oos-modal-box {
    background: var(--oos-surface);
    border-radius: 18px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 680px;
    max-height: 86vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: oos-modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* Modal Top Bar */
  .oos-modal-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--oos-border);
    flex-shrink: 0;
  }
  .oos-modal-topbar-left { display: flex; align-items: center; gap: 14px; }
  .oos-modal-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: var(--oos-bg); border: 1px solid var(--oos-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; flex-shrink: 0;
  }
  .oos-modal-title {
    font-family: var(--font-display);
    font-size: 1.1rem; font-weight: 800;
    color: var(--oos-ink); margin: 0 0 2px;
  }
  .oos-modal-sub { font-size: 0.78rem; color: var(--oos-muted); margin: 0; }
  .oos-modal-close {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--oos-bg); border: 1px solid var(--oos-border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.1rem; color: var(--oos-muted);
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .oos-modal-close:hover { background: var(--oos-accent-soft); color: var(--oos-accent); border-color: #fca5a5; }

  /* Modal Stats Strip */
  .oos-modal-stats-strip {
    display: flex; gap: 10px; flex-wrap: wrap;
    padding: 14px 24px;
    background: #faf9f7;
    border-bottom: 1px solid var(--oos-border);
    flex-shrink: 0;
  }
  .oos-modal-stat {
    display: flex; align-items: center; gap: 7px;
    background: var(--oos-surface); border: 1px solid var(--oos-border);
    border-radius: 10px; padding: 9px 14px;
    font-size: 0.78rem; flex: 1; min-width: 110px;
  }
  .oos-modal-stat__emoji { font-size: 1rem; }
  .oos-modal-stat__val { font-weight: 700; color: var(--oos-ink); font-size: 1rem; }
  .oos-modal-stat__label { color: var(--oos-muted); font-size: 0.72rem; }

  /* Modal Scrollable Body */
  .oos-modal-body {
    overflow-y: auto;
    flex: 1;
    padding: 8px 0;
  }
  .oos-modal-body::-webkit-scrollbar { width: 5px; }
  .oos-modal-body::-webkit-scrollbar-thumb { background: var(--oos-border); border-radius: 99px; }

  /* Product rows */
  .oos-product-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 24px;
    border-bottom: 1px solid var(--oos-border);
    transition: background 0.15s;
    animation: oos-fadeUp 0.3s ease both;
  }
  .oos-product-item:last-child { border-bottom: none; }
  .oos-product-item:hover { background: #faf9f7; }
  .oos-product-thumb {
    width: 44px; height: 44px; border-radius: 10px;
    background: var(--oos-bg); border: 1px solid var(--oos-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 700; color: var(--oos-muted);
    flex-shrink: 0; overflow: hidden;
  }
  .oos-product-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 9px; }
  .oos-product-info { flex: 1; min-width: 0; }
  .oos-product-name { font-weight: 600; color: var(--oos-ink); font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .oos-product-sku { font-size: 0.7rem; color: var(--oos-muted); margin-top: 2px; font-family: monospace; letter-spacing: 0.04em; }
  .oos-product-right {
    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .oos-product-price {
    font-family: var(--font-body); font-weight: 700;
    color: var(--oos-ink); font-size: 0.9rem;
  }
  .oos-oos-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: var(--oos-accent-soft); color: var(--oos-accent);
    font-size: 0.68rem; font-weight: 700;
    padding: 4px 9px; border-radius: 20px;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .oos-oos-badge::before { content: ''; display: block; width: 6px; height: 6px; border-radius: 50%; background: var(--oos-accent); }
  .oos-wl-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: #fff0f3; border: 1px solid #fecdd3;
    border-radius: 20px; padding: 4px 9px;
    font-size: 0.7rem; font-weight: 600; color: #be123c;
    flex-shrink: 0; white-space: nowrap;
  }

  /* ── Animations ── */
  @keyframes oos-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes oos-fadeDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes oos-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes oos-modalIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .oos-product-item:nth-child(1) { animation-delay: 0.03s; }
  .oos-product-item:nth-child(2) { animation-delay: 0.07s; }
  .oos-product-item:nth-child(3) { animation-delay: 0.11s; }
  .oos-product-item:nth-child(4) { animation-delay: 0.15s; }
  .oos-product-item:nth-child(5) { animation-delay: 0.19s; }
  .oos-product-item:nth-child(6) { animation-delay: 0.23s; }
  .oos-product-item:nth-child(7) { animation-delay: 0.27s; }
  .oos-product-item:nth-child(8) { animation-delay: 0.31s; }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
function severityLabel(pct) {
  if (pct >= 25) return { label: "High", cls: "oos-sev--high" };
  if (pct >= 12) return { label: "Medium", cls: "oos-sev--medium" };
  return { label: "Low", cls: "oos-sev--low" };
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Oos() {
  const [activeCategory, setActiveCategory] = useState(null);

  const totalProducts = categoriesData.reduce((s, c) => s + c.total, 0);
  const totalOos = categoriesData.reduce((s, c) => s + c.outOfStock, 0);
  const worstCat = [...categoriesData].sort(
    (a, b) => b.outOfStock / b.total - a.outOfStock / a.total
  )[0];

  return (
    <AppProvider i18n={{}}>
      <style>{styles}</style>
      <div className="oos-root">
        <Page fullWidth>
          {/* Header */}
          <div className="oos-header">
            <h1>Out of Stock</h1>
            <p>Monitor and manage inventory gaps across all product categories.</p>
          </div>

          {/* Summary Stats */}
          <div className="oos-summary">
            <div className="oos-stat oos-stat--alert">
              <div className="oos-stat__label">
                <span className="oos-stat__dot oos-stat__dot--red" />
                Out of Stock
              </div>
              <div className="oos-stat__val">{totalOos}</div>
            </div>
            <div className="oos-stat">
              <div className="oos-stat__label">Total Products</div>
              <div className="oos-stat__val">{totalProducts}</div>
            </div>
            <div className="oos-stat">
              <div className="oos-stat__label">Categories</div>
              <div className="oos-stat__val">{categoriesData.length}</div>
            </div>
            <div className="oos-stat">
              <div className="oos-stat__label">
                <span className="oos-stat__dot oos-stat__dot--amber" />
                OOS Rate
              </div>
              <div className="oos-stat__val">
                {((totalOos / totalProducts) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* ── Custom Banner (replaces Polaris Banner) ── */}
          <div className="oos-banner-wrap">
            <div className="oos-custom-banner">
              <div className="oos-custom-banner__icon">⚠️</div>
              <div className="oos-custom-banner__body">
                <p className="oos-custom-banner__title">
                  {worstCat.name} has the highest stockout rate ({((worstCat.outOfStock / worstCat.total) * 100).toFixed(0)}%)
                </p>
                <p className="oos-custom-banner__desc">
                  Consider restocking this category first. Click any row to view affected products.
                </p>
              </div>
              <span className="oos-custom-banner__badge">
                🔥 Urgent
              </span>
            </div>
          </div>

          {/* Table Card */}
          <div className="oos-card-wrap">
            <div className="oos-card-title">
              <h2>Category Overview</h2>
              <span className="oos-total-pill">{totalOos} items need restocking</span>
            </div>

            <table className="oos-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>OOS / Total</th>
                  <th>Stockout %</th>
                  <th>Wishlists</th>
                  <th>Severity</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.map((cat) => {
                  const pct = (cat.outOfStock / cat.total) * 100;
                  const sev = severityLabel(pct);
                  return (
                    <tr key={cat.id} onClick={() => setActiveCategory(cat)}>
                      <td>
                        <div className="oos-cat-cell">
                          <div className="oos-cat-icon">{cat.icon}</div>
                          <div>
                            <div className="oos-cat-name">{cat.name}</div>
                            <div className="oos-cat-sub">{cat.total} total SKUs</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="oos-count-badge">
                          {cat.outOfStock}
                          <span className="oos-count-total">/ {cat.total}</span>
                        </span>
                      </td>
                      <td>
                        <div className="oos-progress-wrap">
                          <div className="oos-progress-bar-bg">
                            <div
                              className="oos-progress-bar-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="oos-progress-label">
                            <span>{pct.toFixed(1)}%</span>
                            <span>{cat.outOfStock} items</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="oos-wishlist-cell">
                          <div className="oos-wishlist-icon">♥</div>
                          <div>
                            <div className="oos-wishlist-count">{cat.wishlistCount.toLocaleString()}</div>
                            <div className="oos-wishlist-label">wishlists</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`oos-sev ${sev.cls}`}>{sev.label}</span>
                      </td>
                      <td>
                        <div className="oos-row-action">
                          <Badge tone="critical">View Products</Badge>
                          <div className="oos-row-arrow">›</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Page>

        {/* ── Custom Product Modal ── */}
        {activeCategory && (
          <div className="oos-modal-overlay" onClick={() => setActiveCategory(null)}>
            <div className="oos-modal-box" onClick={e => e.stopPropagation()}>

              {/* Top bar */}
              <div className="oos-modal-topbar">
                <div className="oos-modal-topbar-left">
                  <div className="oos-modal-icon">{activeCategory.icon}</div>
                  <div>
                    <p className="oos-modal-title">{activeCategory.name}</p>
                    <p className="oos-modal-sub">Out-of-stock products in this category</p>
                  </div>
                </div>
                <button className="oos-modal-close" onClick={() => setActiveCategory(null)}>✕</button>
              </div>

              {/* Stats strip */}
              <div className="oos-modal-stats-strip">
                <div className="oos-modal-stat">
                  <span className="oos-modal-stat__emoji">🔴</span>
                  <div>
                    <div className="oos-modal-stat__val">{activeCategory.outOfStock}</div>
                    <div className="oos-modal-stat__label">out of stock</div>
                  </div>
                </div>
                <div className="oos-modal-stat">
                  <span className="oos-modal-stat__emoji">📦</span>
                  <div>
                    <div className="oos-modal-stat__val">{activeCategory.total}</div>
                    <div className="oos-modal-stat__label">total SKUs</div>
                  </div>
                </div>
                <div className="oos-modal-stat">
                  <span className="oos-modal-stat__emoji">📊</span>
                  <div>
                    <div className="oos-modal-stat__val">{((activeCategory.outOfStock / activeCategory.total) * 100).toFixed(1)}%</div>
                    <div className="oos-modal-stat__label">stockout rate</div>
                  </div>
                </div>
                <div className="oos-modal-stat">
                  <span className="oos-modal-stat__emoji">♥</span>
                  <div>
                    <div className="oos-modal-stat__val">{activeCategory.wishlistCount.toLocaleString()}</div>
                    <div className="oos-modal-stat__label">wishlists</div>
                  </div>
                </div>
              </div>

              {/* Scrollable product list */}
              <div className="oos-modal-body">
                {activeCategory.products.map((product) => (
                  <div className="oos-product-item" key={product.id}>
                    <div className="oos-product-thumb">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="oos-product-info">
                      <div className="oos-product-name">{product.name}</div>
                      <div className="oos-product-sku">SKU: {product.sku}</div>
                    </div>
                    <div className="oos-product-right">
                      <div className="oos-oos-badge">Out of Stock</div>
                      <div className="oos-wl-chip">♥ {product.wishlist}</div>
                      <div className="oos-product-price">{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </AppProvider>
  );
}