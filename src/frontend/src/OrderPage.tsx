import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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

function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function OrderPage() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const total = ORDER_ITEMS.reduce(
    (sum, item) => sum + (quantities[item.id] ?? 0) * item.price,
    0,
  );
  const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const canSubmit = itemCount > 0 && name.trim() !== "" && phone.trim() !== "";

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

  if (confirmed) {
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
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔥</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "#F3F1ED",
              marginBottom: "0.5rem",
            }}
          >
            Order Confirmed!
          </h2>
          <p
            style={{
              color: "#F2C15B",
              fontSize: "1.1rem",
              marginBottom: "0.5rem",
            }}
          >
            Hey {name}! 🎉
          </p>
          <p
            style={{
              color: "#B9B3AA",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
            }}
          >
            Your pre-order of{" "}
            <span style={{ color: "#F2C15B", fontWeight: 700 }}>₹{total}</span>{" "}
            is locked in.
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
            💸 Pay at the stall · No advance needed
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
      {/* Back button */}
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
        {/* Header */}
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

        {/* Item selection */}
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

        {/* Order summary bar */}
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

        {/* Details form */}
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

        {/* Submit */}
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
            onClick={() => setConfirmed(true)}
            data-ocid="order.submit_button"
            style={{
              opacity: canSubmit ? 1 : 0.4,
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontSize: "1rem",
              padding: "14px 32px",
            }}
          >
            🔥 Confirm Pre-Order · ₹{total || "0"}
          </button>
          {!canSubmit && (
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
