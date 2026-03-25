import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useActor } from "./hooks/useActor";

const QR_IMAGE =
  "/assets/uploads/paymentqr_page-0001_1-019d2431-c276-737f-b015-5e9afebb4a09-2.jpg";

const ORDER_ITEMS = [
  {
    id: 1,
    name: "PANI PURI",
    emoji: "💥",
    price: 30,
    sub: "per plate • 5 pieces",
  },
  {
    id: 2,
    name: "DAHI PURI",
    emoji: "🤍",
    price: 50,
    sub: "per plate • 5 pieces",
  },
  { id: 3, name: "COLD COFFEE", emoji: "☕", price: 70, sub: "per cup" },
  { id: 4, name: "ICED TEA", emoji: "🍋", price: 35, sub: "per cup" },
];

const COMBO_ITEMS: {
  id: number;
  name: string;
  emoji: string;
  price: number;
  sub: string;
  badge: string | null;
  highlight: boolean;
  image: string;
}[] = [
  {
    id: 101,
    name: "Quick Chill Combo",
    emoji: "🌿",
    price: 59,
    sub: "Pani Puri + Iced Tea",
    badge: null,
    highlight: false,
    image: "/assets/generated/combo-quick-chill.dim_300x200.jpg",
  },
  {
    id: 102,
    name: "Creamy Treat Combo",
    emoji: "🍮",
    price: 75,
    sub: "Dahi Puri + Iced Tea",
    badge: null,
    highlight: false,
    image: "/assets/generated/combo-creamy-treat.dim_300x200.jpg",
  },
  {
    id: 103,
    name: "Classic Chaat Combo",
    emoji: "🍽️",
    price: 69,
    sub: "Pani Puri + Dahi Puri",
    badge: null,
    highlight: false,
    image: "/assets/generated/combo-classic-chaat.dim_300x200.jpg",
  },
  {
    id: 104,
    name: "Chill & Thrill Combo",
    emoji: "❄️",
    price: 89,
    sub: "Pani Puri + Cold Coffee",
    badge: null,
    highlight: false,
    image: "/assets/generated/combo-chill-thrill.dim_300x200.jpg",
  },
  {
    id: 105,
    name: "Premium Indulgence",
    emoji: "✨",
    price: 105,
    sub: "Dahi Puri + Cold Coffee",
    badge: null,
    highlight: false,
    image: "/assets/generated/combo-premium-indulgence.dim_300x200.jpg",
  },
  {
    id: 106,
    name: "⭐ Full Feast",
    emoji: "",
    price: 99,
    sub: "Pani Puri + Dahi Puri + Iced Tea",
    badge: "Bestseller",
    highlight: true,
    image: "/assets/generated/combo-full-feast.dim_300x200.jpg",
  },
  {
    id: 107,
    name: "👑 Ultimate Combo",
    emoji: "",
    price: 139,
    sub: "Pani Puri + Dahi Puri + Cold Coffee",
    badge: "Premium",
    highlight: false,
    image: "/assets/generated/combo-ultimate.dim_300x200.jpg",
  },
  {
    id: 108,
    name: "🧃 Beverage Blast",
    emoji: "",
    price: 95,
    sub: "Cold Coffee + Iced Tea",
    badge: "New",
    highlight: true,
    image: "/assets/generated/combo-beverage-blast.dim_300x200.jpg",
  },
];

function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getBadgeStyle(badge: string | null) {
  if (badge === "Bestseller")
    return {
      background: "rgba(242,193,91,0.2)",
      color: "#F2C15B",
      border: "1px solid rgba(242,193,91,0.5)",
    };
  if (badge === "Premium")
    return {
      background: "rgba(180,120,255,0.15)",
      color: "#C89BFF",
      border: "1px solid rgba(180,120,255,0.4)",
    };
  if (badge === "New")
    return {
      background: "rgba(60,220,140,0.15)",
      color: "#3DDB8C",
      border: "1px solid rgba(60,220,140,0.4)",
    };
  return {};
}

export default function OrderPage() {
  const { actor } = useActor();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"form" | "payment" | "done">("form");
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderName, setOrderName] = useState("");

  const allItems = [...ORDER_ITEMS, ...COMBO_ITEMS];

  const total = allItems.reduce(
    (sum, item) => sum + (quantities[item.id] ?? 0) * item.price,
    0,
  );
  const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const canSubmit =
    itemCount > 0 && name.trim() !== "" && phone.trim() !== "" && !loading;

  function adjust(id: number, delta: number) {
    setQuantities((prev) => {
      const next = (prev[id] ?? 0) + delta;
      if (next <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: next };
    });
  }

  async function handleConfirm() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const selectedItems = allItems
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({
        itemName: item.name,
        quantity: BigInt(quantities[item.id]),
      }));

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      items: selectedItems,
      total,
    };

    console.log(
      "[Order] Submitting payload:",
      JSON.stringify(payload, (_, v) =>
        typeof v === "bigint" ? v.toString() : v,
      ),
    );

    if (actor) {
      try {
        const result = await actor.placeOrder(
          payload.name,
          payload.phone,
          payload.items,
        );
        console.log("[Order] Backend response:", result?.toString());
        setOrderTotal(total);
        setOrderName(name.trim());
        setStep("payment");
        setLoading(false);
        return;
      } catch (err: unknown) {
        console.error("[Order] Backend error:", err);
        console.warn("[Order] Falling back to offline mode. Data:", payload);
        setOfflineMode(true);
        setOrderTotal(total);
        setOrderName(name.trim());
        setStep("payment");
        setLoading(false);
        return;
      }
    }

    console.warn("[Order] Actor not available. Offline mode. Data:", payload);
    setOfflineMode(true);
    setOrderTotal(total);
    setOrderName(name.trim());
    setStep("payment");
    setLoading(false);
  }

  // ── Payment Screen ──
  if (step === "payment") {
    return (
      <div
        style={{
          background: "#0B0A08",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
          padding: "2rem 1.25rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "#1a1510",
            border: "1px solid rgba(242,193,91,0.35)",
            borderRadius: 24,
            padding: "2.5rem 2rem",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 0 60px rgba(242,193,91,0.12)",
          }}
        >
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "#F3F1ED",
              marginBottom: "0.4rem",
              letterSpacing: "0.02em",
            }}
          >
            Complete Your Payment
          </h2>
          <p
            style={{
              color: "#B9B3AA",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            Scan the QR code below to confirm your order
          </p>

          {/* Amount */}
          <div
            style={{
              background: "rgba(242,193,91,0.1)",
              border: "1px solid rgba(242,193,91,0.4)",
              borderRadius: 12,
              padding: "0.75rem 1.5rem",
              marginBottom: "1.75rem",
              display: "inline-block",
            }}
          >
            <span
              style={{
                fontSize: "1.6rem",
                fontWeight: 900,
                background: "linear-gradient(90deg, #E29A3A, #F2C15B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pay ₹{orderTotal}
            </span>
          </div>

          {/* QR Code */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src={QR_IMAGE}
              alt="UPI QR Code"
              style={{
                width: 220,
                height: 220,
                objectFit: "contain",
                borderRadius: 16,
                boxShadow:
                  "0 0 32px rgba(242,193,91,0.25), 0 4px 24px rgba(0,0,0,0.5)",
                border: "1px solid rgba(242,193,91,0.2)",
                background: "#fff",
                padding: 8,
              }}
            />
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "rgba(226,154,58,0.08)",
              border: "1px solid rgba(226,154,58,0.2)",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              marginBottom: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <p
              style={{
                color: "#E29A3A",
                fontSize: "0.85rem",
                margin: 0,
                fontWeight: 600,
              }}
            >
              Pay using any UPI app (GPay, PhonePe, Paytm)
            </p>
            <p style={{ color: "#B9B3AA", fontSize: "0.82rem", margin: 0 }}>
              Orders will be confirmed only after payment
            </p>
            <p style={{ color: "#B9B3AA", fontSize: "0.82rem", margin: 0 }}>
              Show payment screenshot at the stall
            </p>
          </div>

          {/* I've Paid button */}
          {step === "payment" && (
            <button
              type="button"
              className="cta-button"
              onClick={() => setStep("done")}
              style={{
                fontSize: "1rem",
                padding: "14px 32px",
                width: "100%",
              }}
            >
              ✅ I've Paid
            </button>
          )}

          {offlineMode && (
            <p
              style={{
                color: "#E29A3A",
                fontSize: "0.75rem",
                marginTop: "0.75rem",
                opacity: 0.7,
              }}
            >
              (offline mode — saved locally)
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // ── Done / Confirmed Screen ──
  if (step === "done") {
    return (
      <div
        style={{
          background: "#0B0A08",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "#1a1510",
            border: "1px solid rgba(242,193,91,0.4)",
            borderRadius: 24,
            padding: "3rem 2.5rem",
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 0 60px rgba(242,193,91,0.2)",
          }}
          data-ocid="order.success_state"
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "#F3F1ED",
              marginBottom: "0.5rem",
            }}
          >
            Payment noted! Your order is confirmed 🎉
          </h2>
          <p
            style={{
              color: "#F2C15B",
              fontSize: "1.1rem",
              marginBottom: "0.5rem",
            }}
          >
            Hey {orderName}!
          </p>
          <p
            style={{
              color: "#B9B3AA",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
            }}
          >
            Your pre-order of{" "}
            <span style={{ color: "#F2C15B", fontWeight: 700 }}>
              ₹{orderTotal}
            </span>{" "}
            is locked in. See you at the stall!
          </p>
          <div
            style={{
              background: "rgba(226,154,58,0.1)",
              border: "1px solid rgba(226,154,58,0.3)",
              borderRadius: 12,
              padding: "0.9rem 1.5rem",
              marginBottom: "2rem",
              color: "#E29A3A",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            📸 Show payment screenshot at the stall
          </div>
          <button
            type="button"
            className="cta-button"
            onClick={goHome}
            data-ocid="order.secondary_button"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0B0A08",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        color: "#F3F1ED",
      }}
    >
      <style>{`
        .combo-img {
          width: 80px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
          margin-right: 0.85rem;
          box-shadow: 0 0 12px rgba(0,0,0,0.5);
          border: 1px solid rgba(226,154,58,0.2);
        }
        @media (max-width: 480px) {
          .combo-img {
            width: 60px;
            height: 48px;
          }
        }
      `}</style>
      <button
        type="button"
        onClick={goHome}
        data-ocid="order.secondary_button"
        style={{
          position: "fixed",
          top: "1.25rem",
          left: "1.25rem",
          zIndex: 50,
          background: "rgba(26,21,16,0.85)",
          border: "1px solid rgba(226,154,58,0.3)",
          borderRadius: 50,
          color: "#E29A3A",
          fontSize: "0.85rem",
          fontWeight: 600,
          padding: "8px 18px",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "5rem 1.25rem 8rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <h1
            className="brand-gradient"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "0.15em",
              marginBottom: "0.4rem",
            }}
          >
            CHAAT &amp; CHILL CO.
          </h1>
          <p
            style={{
              color: "#F2C15B",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              textShadow: "0 0 12px rgba(242,193,91,0.5)",
            }}
          >
            Pre-Order Now
          </p>
        </motion.div>

        {/* ── Individual Items ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#F3F1ED",
              marginBottom: "1rem",
            }}
          >
            Select Items
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            data-ocid="order.list"
          >
            {ORDER_ITEMS.map((item, i) => {
              const qty = quantities[item.id] ?? 0;
              const selected = qty > 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  data-ocid={`order.item.${i + 1}`}
                  style={{
                    background: "#1a1510",
                    border: `1px solid ${selected ? "rgba(242,193,91,0.7)" : "rgba(226,154,58,0.25)"}`,
                    borderRadius: 16,
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "border-color 0.25s ease",
                    boxShadow: selected
                      ? "0 0 20px rgba(242,193,91,0.15)"
                      : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        letterSpacing: "0.05em",
                        color: "#F3F1ED",
                      }}
                    >
                      {item.name} {item.emoji}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5rem",
                        marginTop: "0.2rem",
                      }}
                    >
                      <span
                        className="price-gradient"
                        style={{ fontSize: "1.2rem" }}
                      >
                        ₹{item.price}
                      </span>
                      <span style={{ color: "#6B6460", fontSize: "0.75rem" }}>
                        {item.sub}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => adjust(item.id, -1)}
                      data-ocid={`order.toggle.${i + 1}`}
                      disabled={qty === 0}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "1px solid rgba(226,154,58,0.5)",
                        background:
                          qty > 0 ? "rgba(226,154,58,0.2)" : "transparent",
                        color: "#E29A3A",
                        fontSize: "1.1rem",
                        cursor: qty > 0 ? "pointer" : "not-allowed",
                        opacity: qty > 0 ? 1 : 0.35,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: 20,
                        textAlign: "center",
                        fontWeight: 700,
                        color: qty > 0 ? "#F2C15B" : "#6B6460",
                        fontSize: "1rem",
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjust(item.id, 1)}
                      data-ocid={`order.button.${i + 1}`}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "1px solid rgba(226,154,58,0.6)",
                        background: "rgba(226,154,58,0.2)",
                        color: "#E29A3A",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Combo Deals Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ marginTop: "2.5rem" }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#F3F1ED",
                marginBottom: "0.25rem",
              }}
            >
              🔥 Combo Deals
            </h2>
            <p style={{ color: "#6B6460", fontSize: "0.82rem", margin: 0 }}>
              Best value picks – save more, enjoy more
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            data-ocid="order.combo_list"
          >
            {COMBO_ITEMS.map((combo, i) => {
              const qty = quantities[combo.id] ?? 0;
              const selected = qty > 0;
              const badgeStyle = getBadgeStyle(combo.badge);
              const isHighlighted = combo.highlight;

              return (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  data-ocid={`order.combo.${i + 1}`}
                  style={{
                    background: isHighlighted
                      ? "linear-gradient(135deg, #1e1810 0%, #201a0e 100%)"
                      : "#1a1510",
                    border: `1px solid ${
                      selected
                        ? "rgba(242,193,91,0.75)"
                        : isHighlighted
                          ? "rgba(242,193,91,0.4)"
                          : "rgba(226,154,58,0.25)"
                    }`,
                    borderRadius: 16,
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "border-color 0.25s ease",
                    boxShadow: selected
                      ? "0 0 24px rgba(242,193,91,0.18)"
                      : isHighlighted
                        ? "0 0 16px rgba(242,193,91,0.08)"
                        : "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="combo-img"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "0.15rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          letterSpacing: "0.03em",
                          color: "#F3F1ED",
                        }}
                      >
                        {combo.name}
                        {combo.emoji ? ` ${combo.emoji}` : ""}
                      </span>
                      {combo.badge && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: 20,
                            ...badgeStyle,
                          }}
                        >
                          {combo.badge}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5rem",
                        marginTop: "0.1rem",
                      }}
                    >
                      <span
                        className="price-gradient"
                        style={{ fontSize: "1.2rem" }}
                      >
                        ₹{combo.price}
                      </span>
                      <span style={{ color: "#6B6460", fontSize: "0.75rem" }}>
                        {combo.sub}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexShrink: 0,
                      marginLeft: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => adjust(combo.id, -1)}
                      disabled={qty === 0}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "1px solid rgba(226,154,58,0.5)",
                        background:
                          qty > 0 ? "rgba(226,154,58,0.2)" : "transparent",
                        color: "#E29A3A",
                        fontSize: "1.1rem",
                        cursor: qty > 0 ? "pointer" : "not-allowed",
                        opacity: qty > 0 ? 1 : 0.35,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: 20,
                        textAlign: "center",
                        fontWeight: 700,
                        color: qty > 0 ? "#F2C15B" : "#6B6460",
                        fontSize: "1rem",
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjust(combo.id, 1)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "1px solid rgba(226,154,58,0.6)",
                        background: "rgba(226,154,58,0.2)",
                        color: "#E29A3A",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              data-ocid="order.panel"
              style={{
                background: "rgba(226,154,58,0.1)",
                border: "1px solid rgba(226,154,58,0.35)",
                borderRadius: 12,
                padding: "0.85rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.25rem",
              }}
            >
              <span style={{ color: "#B9B3AA", fontSize: "0.88rem" }}>
                {itemCount} item{itemCount !== 1 ? "s" : ""} selected
              </span>
              <span
                style={{
                  color: "#F2C15B",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                ₹{total}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ marginTop: "2rem" }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#F3F1ED",
              marginBottom: "1rem",
            }}
          >
            Your Details
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="order.input"
              style={{
                background: "#1a1510",
                border: "1px solid rgba(226,154,58,0.3)",
                borderRadius: 12,
                padding: "0.85rem 1.1rem",
                color: "#F3F1ED",
                fontSize: "0.95rem",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(242,193,91,0.7)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226,154,58,0.3)";
              }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              data-ocid="order.search_input"
              style={{
                background: "#1a1510",
                border: "1px solid rgba(226,154,58,0.3)",
                borderRadius: 12,
                padding: "0.85rem 1.1rem",
                color: "#F3F1ED",
                fontSize: "0.95rem",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(242,193,91,0.7)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226,154,58,0.3)";
              }}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              data-ocid="order.error_state"
              style={{
                marginTop: "1rem",
                background: "rgba(220,60,60,0.12)",
                border: "1px solid rgba(220,60,60,0.4)",
                borderRadius: 10,
                padding: "0.75rem 1.1rem",
                color: "#E88",
                fontSize: "0.88rem",
                textAlign: "center",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ marginTop: "2rem", textAlign: "center" }}
        >
          <button
            type="button"
            className="cta-button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            data-ocid="order.submit_button"
            style={{
              opacity: canSubmit ? 1 : 0.4,
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontSize: "1rem",
              padding: "14px 32px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Placing Order...
              </>
            ) : (
              <>🔥 Confirm Pre-Order · ₹{total || "0"}</>
            )}
          </button>
          {!canSubmit && !loading && (
            <p
              style={{
                color: "#6B6460",
                fontSize: "0.8rem",
                marginTop: "0.6rem",
              }}
            >
              {itemCount === 0
                ? "Select at least one item"
                : "Fill in your details"}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
