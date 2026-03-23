import { motion } from "motion/react";
import { useEffect, useState } from "react";
import OrderPage from "./OrderPage";

const products = [
  {
    id: 1,
    name: "PANI PURI",
    image: "/assets/generated/pani-puri.dim_600x600.jpg",
    description: "5 pieces of pure chaos 💥",
    price: "₹30",
    sub: "per plate • 5 pieces",
    note: null,
  },
  {
    id: 2,
    name: "DAHI PURI",
    image: "/assets/generated/dahi-puri.dim_600x600.jpg",
    description: "Creamy, tangy perfection 🤍",
    price: "₹50",
    sub: "per plate • 5 pieces",
    note: null,
  },
  {
    id: 3,
    name: "COLD COFFEE",
    image: "/assets/generated/cold-coffee.dim_600x600.jpg",
    description: "Chill after the spice ☕",
    price: "₹70",
    sub: "per cup",
    note: "Limited batches • may vary with demand",
  },
  {
    id: 4,
    name: "ICED TEA",
    image: "/assets/generated/iced-tea.dim_600x600.jpg",
    description: "Light. Fresh. Cooling 🍋",
    price: "₹35",
    sub: "per cup",
    note: null,
  },
];

const PARTICLE_TOPS = ["18%", "65%", "40%", "75%", "30%", "55%"];
const PARTICLE_LEFTS = ["15%", "20%", "82%", "78%", "88%", "12%"];
const PARTICLE_SIZES = [8, 5, 6, 4, 7, 5];
const PARTICLE_COLORS = [
  "#E29A3A",
  "#F2C15B",
  "#D8842F",
  "#F2C15B",
  "#E29A3A",
  "#D8842F",
];
const PRODUCT_OCIDS = [
  "products.item.1",
  "products.item.2",
  "products.item.3",
  "products.item.4",
];
const BUTTON_OCIDS = [
  "products.secondary_button.1",
  "products.secondary_button.2",
  "products.secondary_button.3",
  "products.secondary_button.4",
];

function goToOrder() {
  window.history.pushState({}, "", "/order");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function LandingPage() {
  return (
    <div
      style={{
        background: "#0B0A08",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        color: "#F3F1ED",
      }}
    >
      {/* ==================== HERO SECTION ==================== */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "2rem 1.5rem",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,116,42,0.35) 0%, rgba(11,10,8,0) 70%), #0B0A08",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "6%",
            fontSize: "3.5rem",
            zIndex: 2,
          }}
          className="float-1"
        >
          🍋
        </div>
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "8%",
            fontSize: "2.8rem",
            zIndex: 0,
            filter: "blur(2px)",
            opacity: 0.6,
          }}
          className="float-2"
        >
          🧊
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "9%",
            fontSize: "2.5rem",
            zIndex: 0,
            filter: "blur(1.5px)",
            opacity: 0.55,
          }}
          className="float-3"
        >
          🫙
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "7%",
            fontSize: "2rem",
            zIndex: 2,
          }}
          className="float-4"
        >
          🌶️
        </div>

        {PARTICLE_TOPS.map((_, i) => (
          <div
            key={PARTICLE_TOPS[i] + PARTICLE_LEFTS[i]}
            className="pulse-glow"
            style={{
              position: "absolute",
              width: PARTICLE_SIZES[i],
              height: PARTICLE_SIZES[i],
              borderRadius: "50%",
              background: PARTICLE_COLORS[i],
              top: PARTICLE_TOPS[i],
              left: PARTICLE_LEFTS[i],
              zIndex: 1,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            maxWidth: 800,
            width: "100%",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="brand-gradient"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "0.15em",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            CHAAT &amp; CHILL CO.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              color: "#FFD580",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              marginBottom: "2.5rem",
              textShadow: "0 0 12px rgba(255,213,128,0.5)",
            }}
          >
            TAPMI&apos;s most talked-about food stall
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            style={{ marginBottom: "1.2rem" }}
          >
            <div
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#F3F1ED",
                letterSpacing: "-0.01em",
              }}
            >
              Not Just Food.
            </div>
            <div
              className="headline-gradient"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              A Moment.
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              color: "#8A8A8A",
              fontSize: "1.1rem",
              marginBottom: "2.5rem",
              letterSpacing: "0.05em",
            }}
          >
            Spice. Chill. Repeat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              className="cta-button"
              onClick={goToOrder}
              data-ocid="hero.primary_button"
            >
              🔥 Grab Offer Now
            </button>
            <p
              style={{
                color: "#6B6460",
                fontSize: "0.82rem",
                letterSpacing: "0.03em",
              }}
            >
              Lock your price before it increases
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== PRODUCTS SECTION ==================== */}
      <section
        id="menu"
        style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#F3F1ED",
              marginBottom: "0.5rem",
            }}
          >
            Choose Your Vibe
          </h2>
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, #D8842F, #F2C15B)",
              borderRadius: 2,
              margin: "0 auto",
            }}
          />
        </motion.div>

        <div
          data-ocid="products.table"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              className="product-card"
              data-ocid={PRODUCT_OCIDS[i]}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#F3F1ED",
                    marginBottom: "0.25rem",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    color: "#B9B3AA",
                    fontSize: "0.88rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {p.description}
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <span className="price-gradient">{p.price}</span>
                <p
                  style={{
                    color: "#6B6460",
                    fontSize: "0.78rem",
                    marginTop: "0.15rem",
                  }}
                >
                  {p.sub}
                </p>
                {p.note && (
                  <p
                    style={{
                      color: "#E29A3A",
                      fontSize: "0.72rem",
                      marginTop: "0.5rem",
                      opacity: 0.75,
                    }}
                  >
                    ⚡ {p.note}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="cta-button"
                onClick={goToOrder}
                style={{
                  fontSize: "0.85rem",
                  padding: "10px 20px",
                  marginTop: "0.5rem",
                }}
                data-ocid={BUTTON_OCIDS[i]}
              >
                Order Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== URGENCY SECTION ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          padding: "5rem 1.5rem 6rem",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,116,42,0.18) 0%, transparent 70%)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(226,154,58,0.12)",
            border: "1px solid rgba(226,154,58,0.35)",
            borderRadius: 50,
            padding: "6px 18px",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#E29A3A",
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "#E29A3A",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            LIMITED AVAILABILITY
          </span>
        </div>

        <h2
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
            fontWeight: 800,
            color: "#F2C15B",
            marginBottom: "0.6rem",
            textShadow: "0 0 20px rgba(242,193,91,0.35)",
          }}
        >
          Only limited servings available
        </h2>
        <p
          style={{
            color: "#B9B3AA",
            fontSize: "1.05rem",
            marginBottom: "2.5rem",
          }}
        >
          Pre-order to avoid missing out
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            className="cta-button"
            style={{ fontSize: "1.05rem", padding: "16px 44px" }}
            onClick={goToOrder}
            data-ocid="urgency.primary_button"
          >
            🔥 Grab Offer Now
          </button>
          <p style={{ color: "#6B6460", fontSize: "0.82rem" }}>
            Skip the line. Just arrive.
          </p>
        </div>
      </motion.section>

      {/* ==================== FOOTER ==================== */}
      <footer
        style={{
          borderTop: "1px solid rgba(226,154,58,0.15)",
          padding: "2.5rem 1.5rem",
          textAlign: "center",
          background: "#0B0A08",
        }}
      >
        <div
          className="brand-gradient"
          style={{
            fontSize: "1.4rem",
            fontWeight: 900,
            letterSpacing: "0.12em",
            marginBottom: "0.5rem",
          }}
        >
          CHAAT &amp; CHILL CO.
        </div>
        <p style={{ color: "#6B6460", fontSize: "0.78rem" }}>
          TAPMI&apos;s favourite street food stall • Spice. Chill. Repeat.
        </p>
        <p
          style={{
            color: "#3A3530",
            fontSize: "0.72rem",
            marginTop: "1.25rem",
          }}
        >
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6B5A40", textDecoration: "none" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  if (path === "/order") return <OrderPage />;
  return <LandingPage />;
}
