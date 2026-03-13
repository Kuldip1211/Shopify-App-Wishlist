import { useState } from "react";
import { AppProvider, Page, Badge } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import "./styled/oos.css";

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
      { id: 101, name: "Classic White Tee",         sku: "TSH-001", price: "$19.99", wishlist: 38, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 102, name: "Graphic Print Tee – Urban", sku: "TSH-002", price: "$24.99", wishlist: 21, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 103, name: "Striped Polo Tee",           sku: "TSH-003", price: "$29.99", wishlist: 14, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 104, name: "Oversized Drop Shoulder",    sku: "TSH-004", price: "$34.99", wishlist: 29, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 105, name: "V-Neck Essential",           sku: "TSH-005", price: "$22.99", wishlist: 17, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 106, name: "Tie-Dye Festival Tee",       sku: "TSH-006", price: "$27.99", wishlist: 11, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
      { id: 107, name: "Henley Long Sleeve",         sku: "TSH-007", price: "$31.99", wishlist: 13, image: "https://placehold.co/60x60/f3f4f6/374151?text=TS" },
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
      { id: 201, name: "Air Bounce Low",       sku: "SNK-001", price: "$89.99",  wishlist: 74, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 202, name: "Runner Pro X2",        sku: "SNK-002", price: "$119.99", wishlist: 91, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 203, name: "Canvas High-Top",      sku: "SNK-003", price: "$74.99",  wishlist: 33, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 204, name: "Trail Hiker Lite",     sku: "SNK-004", price: "$134.99", wishlist: 58, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 205, name: "Court Classic White",  sku: "SNK-005", price: "$99.99",  wishlist: 47, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 206, name: "Slip-On Wave",         sku: "SNK-006", price: "$64.99",  wishlist: 29, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 207, name: "Boost Cushion Run",    sku: "SNK-007", price: "$149.99", wishlist: 62, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 208, name: "Retro Skate Low",      sku: "SNK-008", price: "$84.99",  wishlist: 41, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 209, name: "Mesh Sprint V3",       sku: "SNK-009", price: "$109.99", wishlist: 38, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 210, name: "Chunky Dad Sneaker",   sku: "SNK-010", price: "$129.99", wishlist: 19, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 211, name: "Neon Racer Edition",   sku: "SNK-011", price: "$159.99", wishlist: 11, image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
      { id: 212, name: "Minimalist Knit",      sku: "SNK-012", price: "$94.99",  wishlist: 9,  image: "https://placehold.co/60x60/f3f4f6/374151?text=SN" },
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
      { id: 301, name: "Puffer Jacket – Black",  sku: "JKT-001", price: "$149.99", wishlist: 42, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
      { id: 302, name: "Denim Trucker Jacket",   sku: "JKT-002", price: "$89.99",  wishlist: 27, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
      { id: 303, name: "Windbreaker Slim Fit",   sku: "JKT-003", price: "$109.99", wishlist: 13, image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
      { id: 304, name: "Sherpa Fleece Jacket",   sku: "JKT-004", price: "$129.99", wishlist: 7,  image: "https://placehold.co/60x60/f3f4f6/374151?text=JK" },
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
      { id: 401, name: "Canvas Tote Bag",         sku: "ACC-001", price: "$29.99",  wishlist: 44, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 402, name: "Leather Belt – Brown",    sku: "ACC-002", price: "$44.99",  wishlist: 18, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 403, name: "Snapback Cap – Logo",     sku: "ACC-003", price: "$24.99",  wishlist: 31, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 404, name: "Woven Sling Bag",         sku: "ACC-004", price: "$54.99",  wishlist: 22, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 405, name: "Wool Beanie – Winter",    sku: "ACC-005", price: "$19.99",  wishlist: 15, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 406, name: "Sunglasses – Polarized",  sku: "ACC-006", price: "$69.99",  wishlist: 39, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 407, name: "Watch – Minimalist",      sku: "ACC-007", price: "$199.99", wishlist: 67, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 408, name: "Scarves – Plaid Print",   sku: "ACC-008", price: "$34.99",  wishlist: 9,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 409, name: "Leather Wallet – Slim",   sku: "ACC-009", price: "$49.99",  wishlist: 28, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 410, name: "Phone Case – Clear",      sku: "ACC-010", price: "$14.99",  wishlist: 12, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 411, name: "Keychain – Metal Engraved",sku: "ACC-011", price: "$9.99",  wishlist: 6,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 412, name: "Bandana – Paisley",       sku: "ACC-012", price: "$12.99",  wishlist: 4,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 413, name: 'Laptop Sleeve 15"',       sku: "ACC-013", price: "$39.99",  wishlist: 11, image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 414, name: "Passport Holder",         sku: "ACC-014", price: "$22.99",  wishlist: 8,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 415, name: "Gym Duffel – Black",      sku: "ACC-015", price: "$79.99",  wishlist: 5,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 416, name: "Hair Clip Set",           sku: "ACC-016", price: "$8.99",   wishlist: 3,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 417, name: "Jewelry Box – Travel",    sku: "ACC-017", price: "$29.99",  wishlist: 7,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
      { id: 418, name: "Sports Armband",          sku: "ACC-018", price: "$17.99",  wishlist: 5,  image: "https://placehold.co/60x60/f3f4f6/374151?text=AC" },
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
      { id: 502, name: "Relaxed Joggers",         sku: "PNT-002", price: "$49.99", wishlist: 28, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 503, name: "Skinny Jeans – Black",    sku: "PNT-003", price: "$69.99", wishlist: 41, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 504, name: "Wide Leg Denim",          sku: "PNT-004", price: "$79.99", wishlist: 19, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 505, name: "Cargo Pants – Olive",     sku: "PNT-005", price: "$74.99", wishlist: 33, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 506, name: "Linen Trousers",          sku: "PNT-006", price: "$64.99", wishlist: 15, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 507, name: "Pleated Dress Pants",     sku: "PNT-007", price: "$89.99", wishlist: 12, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 508, name: "Ripped Skinny Jeans",     sku: "PNT-008", price: "$72.99", wishlist: 14, image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
      { id: 509, name: "Track Pants – Striped",   sku: "PNT-009", price: "$44.99", wishlist: 9,  image: "https://placehold.co/60x60/f3f4f6/374151?text=PN" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function severityLabel(pct) {
  if (pct >= 25) return { label: "High",   cls: "oos-sev--high"   };
  if (pct >= 12) return { label: "Medium", cls: "oos-sev--medium" };
  return             { label: "Low",    cls: "oos-sev--low"    };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Oos() {
  const [activeCategory, setActiveCategory] = useState(null);

  const totalProducts = categoriesData.reduce((s, c) => s + c.total,      0);
  const totalOos      = categoriesData.reduce((s, c) => s + c.outOfStock, 0);
  const worstCat      = [...categoriesData].sort(
    (a, b) => b.outOfStock / b.total - a.outOfStock / a.total
  )[0];

  return (
    <AppProvider i18n={{}}>
      <div className="oos-root">
        <Page fullWidth>

          {/* ── Header ── */}
          <div className="oos-header">
            <h1>Out of Stock</h1>
            <p>Monitor and manage inventory gaps across all product categories.</p>
          </div>

          {/* ── Summary Stats ── */}
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

          {/* ── Banner ── */}
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
              <span className="oos-custom-banner__badge">🔥 Urgent</span>
            </div>
          </div>

          {/* ── Table Card ── */}
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
                  <th className="oos-th--right">Action</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.map((cat) => {
                  const pct = (cat.outOfStock / cat.total) * 100;
                  const sev = severityLabel(pct);
                  return (
                    <tr key={cat.id} onClick={() => setActiveCategory(cat)}>

                      {/* Category */}
                      <td>
                        <div className="oos-cat-cell">
                          <div className="oos-cat-icon">{cat.icon}</div>
                          <div>
                            <div className="oos-cat-name">{cat.name}</div>
                            <div className="oos-cat-sub">{cat.total} total SKUs</div>
                          </div>
                        </div>
                      </td>

                      {/* OOS count */}
                      <td>
                        <span className="oos-count-badge">
                          {cat.outOfStock}
                          <span className="oos-count-total">/ {cat.total}</span>
                        </span>
                      </td>

                      {/* Progress */}
                      <td>
                        <div className="oos-progress-wrap">
                          <div className="oos-progress-bar-bg">
                            <div className="oos-progress-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="oos-progress-label">
                            <span>{pct.toFixed(1)}%</span>
                            <span>{cat.outOfStock} items</span>
                          </div>
                        </div>
                      </td>

                      {/* Wishlists */}
                      <td>
                        <div className="oos-wishlist-cell">
                          <div className="oos-wishlist-icon">♥</div>
                          <div>
                            <div className="oos-wishlist-count">{cat.wishlistCount.toLocaleString()}</div>
                            <div className="oos-wishlist-label">wishlists</div>
                          </div>
                        </div>
                      </td>

                      {/* Severity */}
                      <td>
                        <span className={`oos-sev ${sev.cls}`}>{sev.label}</span>
                      </td>

                      {/* Action */}
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

        {/* ── Modal ── */}
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
                {[
                  { emoji: "🔴", val: activeCategory.outOfStock,                                          label: "out of stock"  },
                  { emoji: "📦", val: activeCategory.total,                                               label: "total SKUs"    },
                  { emoji: "📊", val: `${((activeCategory.outOfStock / activeCategory.total) * 100).toFixed(1)}%`, label: "stockout rate" },
                  { emoji: "♥",  val: activeCategory.wishlistCount.toLocaleString(),                      label: "wishlists"     },
                ].map((s, i) => (
                  <div key={i} className="oos-modal-stat">
                    <span className="oos-modal-stat__emoji">{s.emoji}</span>
                    <div>
                      <div className="oos-modal-stat__val">{s.val}</div>
                      <div className="oos-modal-stat__label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product list */}
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