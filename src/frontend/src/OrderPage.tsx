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

function formatDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dd = String(date.getDate()).padStart(2, "0");
  const mmm = months[date.getMonth()];
  const yyyy = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${dd} ${mmm} ${yyyy}, ${hours}:${minutes} ${ampm}`;
}

const divider = (
  <div
    style={{
      height: 1,
      background: "rgba(226,154,58,0.25)",
      margin: "1.25rem 0",
    }}
  />
);

export default function OrderPage() {
  const { actor } = useActor();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"form" | "payment" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderItems, setOrderItems] = useState<{ name: string; qty: number }[]>(
    [],
  );
  const [confirmedAt, setConfirmedAt] = useState<Date | null>(null);
  const [savedTransactionId, setSavedTransactionId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [txError, setTxError] = useState<string | null>(null);

  const allItems = [...ORDER_ITEMS, ...COMBO_ITEMS];

  const total = allItems.reduce(
    (sum, item) => sum + (quantities[item.id] ?? 0) * item.price,
    0,
  );
  const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const canProceed = itemCount > 0 && name.trim() !== "" && phone.trim() !== "";

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

  function handleProceedToPayment() {
    if (!canProceed) return;
    setError(null);
    setOrderTotal(total);
    setOrderName(name.trim());
    setStep("payment");
  }

  async function handleConfirmPayment() {
    if (transactionId.trim().length < 8) {
      setTxError(
        transactionId.trim() === ""
          ? "Please enter your UPI Transaction ID"
          : "Transaction ID must be at least 8 characters",
      );
      return;
    }
    setTxError(null);
    setLoading(true);

    const selectedItems = allItems
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({
        itemName: item.name,
        quantity: BigInt(quantities[item.id]),
      }));

    const orderItemsSummary = allItems
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({ name: item.name, qty: quantities[item.id] }));

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      items: selectedItems,
      total: orderTotal,
    };

    console.log(
      "[Order] Saving order after payment confirmation:",
      JSON.stringify(payload, (_, v) =>
        typeof v === "bigint" ? v.toString() : v,
      ),
    );

    if (actor) {
      try {
        await actor.placeOrder(payload.name, payload.phone, payload.items);
      } catch (err) {
        console.warn("[Order] Backend error (offline mode):", err);
      }
    } else {
      console.warn("[Order] Actor unavailable. Offline mode. Data:", payload);
    }

    setOrderItems(orderItemsSummary);
    setOrderPhone(phone.trim());
    setSavedTransactionId(transactionId.trim());
    setConfirmedAt(new Date());
    setLoading(false);
    setStep("done");
  }

  function downloadReceipt() {
    const W = 480;
    const PADDING = 36;
    const LINE_H = 28;
    const SECTION_GAP = 18;

    // Pre-calculate height
    const headerLines = 4; // brand title + divider + spacing
    const detailRows = 4; // name, phone, txid, datetime
    const itemRows = orderItems.length;
    const footerLines = 3;
    const estimatedHeight =
      120 + // top padding + header
      headerLines * LINE_H +
      SECTION_GAP * 2 +
      detailRows * LINE_H +
      SECTION_GAP +
      24 + // items heading
      itemRows * LINE_H +
      SECTION_GAP +
      LINE_H * 2 + // total
      SECTION_GAP +
      footerLines * LINE_H +
      60; // bottom padding

    const canvas = document.createElement("canvas");
    canvas.width = W * 2; // retina
    canvas.height = estimatedHeight * 2;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${estimatedHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(2, 2);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, estimatedHeight);

    let y = 44;

    // Brand title
    ctx.fillStyle = "#1a1108";
    ctx.font = "bold 22px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CHAAT & CHILL CO.", W / 2, y);
    y += 10;

    // Orange divider
    ctx.strokeStyle = "#E29A3A";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(W - PADDING, y);
    ctx.stroke();
    y += 20;

    // Helper: draw a label-value row
    function drawRow(label: string, value: string) {
      ctx!.font = "600 12px 'Arial', sans-serif";
      ctx!.textAlign = "left";
      ctx!.fillStyle = "#888888";
      ctx!.fillText(label, PADDING, y);

      ctx!.font = "600 13px 'Arial', sans-serif";
      ctx!.textAlign = "right";
      ctx!.fillStyle = "#1a1108";
      ctx!.fillText(value, W - PADDING, y);
      y += LINE_H;
    }

    drawRow("Name", orderName);
    drawRow("Phone", orderPhone);
    drawRow("Transaction ID", savedTransactionId);
    drawRow("Date & Time", confirmedAt ? formatDate(confirmedAt) : "-");

    y += 4;
    // Thin divider
    ctx.strokeStyle = "#E8E0D4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(W - PADDING, y);
    ctx.stroke();
    y += SECTION_GAP;

    // Items heading
    ctx.font = "bold 11px 'Arial', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#888888";
    ctx.fillText("ITEMS ORDERED", PADDING, y);
    y += LINE_H;

    // Items list
    for (const item of orderItems) {
      ctx.font = "500 13px 'Arial', sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = "#333333";
      ctx.fillText(`• ${item.name}`, PADDING + 4, y);

      ctx.textAlign = "right";
      ctx.fillStyle = "#555555";
      ctx.fillText(`× ${item.qty}`, W - PADDING, y);
      y += LINE_H;
    }

    y += 4;
    // Divider before total
    ctx.strokeStyle = "#E8E0D4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(W - PADDING, y);
    ctx.stroke();
    y += SECTION_GAP;

    // Total
    ctx.font = "bold 13px 'Arial', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#888888";
    ctx.fillText("TOTAL AMOUNT", PADDING, y);

    ctx.font = "bold 20px 'Arial', sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "#E29A3A";
    ctx.fillText(`\u20B9${orderTotal}`, W - PADDING, y);
    y += LINE_H + 8;

    // Orange divider
    ctx.strokeStyle = "#E29A3A";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PADDING, y);
    ctx.lineTo(W - PADDING, y);
    ctx.stroke();
    y += SECTION_GAP;

    // Footer
    ctx.font = "600 12px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#888888";
    ctx.fillText("Thank you for your order!", W / 2, y);
    y += LINE_H;
    ctx.font = "500 11px 'Arial', sans-serif";
    ctx.fillStyle = "#AAAAAA";
    ctx.fillText(
      "Show this receipt at the stall to collect your order.",
      W / 2,
      y,
    );

    // Trigger download
    const link = document.createElement("a");
    link.download = `chaat-chill-receipt-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: "#1a1510",
            border: "1px solid rgba(242,193,91,0.35)",
            borderRadius: 24,
            padding: "2.5rem 2rem",
            maxWidth: 440,
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
            Scan QR and complete payment
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
                fontSize: "1.7rem",
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
              gap: "0.4rem",
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
              Scan QR and complete payment
            </p>
            <p style={{ color: "#B9B3AA", fontSize: "0.82rem", margin: 0 }}>
              After payment, enter your transaction ID below
            </p>
          </div>

          {/* Transaction ID Input */}
          <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
            <label
              htmlFor="txid"
              style={{
                display: "block",
                color: "#F2C15B",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                letterSpacing: "0.04em",
              }}
            >
              Enter UPI Transaction ID
            </label>
            <input
              type="text"
              id="txid"
              placeholder="e.g. 123456789012"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                setTxError(null);
              }}
              style={{
                width: "100%",
                background: "#120f0a",
                border: `1px solid ${txError ? "rgba(220,60,60,0.6)" : "rgba(226,154,58,0.35)"}`,
                borderRadius: 12,
                padding: "0.85rem 1.1rem",
                color: "#F3F1ED",
                fontSize: "0.95rem",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(242,193,91,0.7)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = txError
                  ? "rgba(220,60,60,0.6)"
                  : "rgba(226,154,58,0.35)";
              }}
            />
            <AnimatePresence>
              {txError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: "#E88",
                    fontSize: "0.8rem",
                    marginTop: "0.4rem",
                    margin: "0.4rem 0 0",
                  }}
                >
                  {txError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Confirm Payment & Place Order */}
          <button
            type="button"
            className="cta-button"
            onClick={handleConfirmPayment}
            disabled={loading}
            style={{
              fontSize: "1rem",
              padding: "14px 32px",
              width: "100%",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
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
                Saving Order...
              </>
            ) : (
              <>✅ Confirm Payment &amp; Place Order</>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStep("form")}
            style={{
              marginTop: "1rem",
              background: "transparent",
              border: "none",
              color: "#6B6460",
              fontSize: "0.82rem",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ← Go back and edit order
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Receipt / Done Screen ──
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
          padding: "2rem 1.25rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          data-ocid="order.success_state"
          style={{
            background: "#1a1510",
            border: "1px solid rgba(242,193,91,0.4)",
            borderRadius: 24,
            padding: "2.5rem 2rem",
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 0 60px rgba(242,193,91,0.2)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.6rem" }}>🎉</div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 900,
                color: "#F3F1ED",
                margin: "0 0 0.5rem",
                letterSpacing: "0.02em",
              }}
            >
              Order Confirmed 🎉
            </h2>
            <p
              style={{
                color: "#B9B3AA",
                fontSize: "0.88rem",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Show this receipt at the stall to collect your order
            </p>
          </div>

          {divider}

          {/* Receipt Details */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {(
              [
                ["Name", orderName],
                ["Phone", orderPhone],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    color: "#6B6460",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    color: "#F3F1ED",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}

            {/* Transaction ID */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span
                style={{ color: "#6B6460", fontSize: "0.85rem", flexShrink: 0 }}
              >
                Transaction ID
              </span>
              <span
                style={{
                  color: "#F2C15B",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {savedTransactionId}
              </span>
            </div>

            {/* Date & Time */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span
                style={{ color: "#6B6460", fontSize: "0.85rem", flexShrink: 0 }}
              >
                Date &amp; Time
              </span>
              <span
                style={{
                  color: "#F3F1ED",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                {confirmedAt ? formatDate(confirmedAt) : "—"}
              </span>
            </div>
          </div>

          {divider}

          {/* Items Ordered */}
          <div>
            <p
              style={{
                color: "#6B6460",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 0.6rem",
                fontWeight: 600,
              }}
            >
              Items Ordered
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              {orderItems.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  style={{
                    color: "#B9B3AA",
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span style={{ color: "#E29A3A", fontSize: "0.75rem" }}>
                    •
                  </span>
                  {item.name} × {item.qty}
                </div>
              ))}
            </div>
          </div>

          {divider}

          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#6B6460",
                fontSize: "0.9rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Total Amount
            </span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                background: "linear-gradient(90deg, #E29A3A, #F2C15B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ₹{orderTotal}
            </span>
          </div>

          <div
            style={{
              marginTop: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {/* Download Receipt Button */}
            <button
              type="button"
              onClick={downloadReceipt}
              data-ocid="order.secondary_button"
              style={{
                width: "100%",
                fontSize: "1rem",
                fontWeight: 700,
                padding: "14px 32px",
                background: "rgba(242,193,91,0.1)",
                border: "1px solid rgba(242,193,91,0.5)",
                color: "#F2C15B",
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(242,193,91,0.18)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(242,193,91,0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(242,193,91,0.1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(242,193,91,0.5)";
              }}
            >
              ⬇ Download Receipt
            </button>

            {/* Back to Home Button */}
            <button
              type="button"
              className="cta-button"
              onClick={goHome}
              data-ocid="order.primary_button"
              style={{ width: "100%", fontSize: "1rem", padding: "14px 32px" }}
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Order Form ──
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
        .combo-img { width: 80px; height: 60px; border-radius: 10px; object-fit: cover; flex-shrink: 0; margin-right: 0.85rem; box-shadow: 0 0 12px rgba(0,0,0,0.5); border: 1px solid rgba(226,154,58,0.2); }
        @media (max-width: 480px) { .combo-img { width: 60px; height: 48px; } }
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

        {/* Individual Items */}
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

        {/* Combo Deals */}
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
                    border: `1px solid ${selected ? "rgba(242,193,91,0.75)" : isHighlighted ? "rgba(242,193,91,0.4)" : "rgba(226,154,58,0.25)"}`,
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

        {/* Your Details */}
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
            disabled={!canProceed}
            onClick={handleProceedToPayment}
            data-ocid="order.submit_button"
            style={{
              opacity: canProceed ? 1 : 0.4,
              cursor: canProceed ? "pointer" : "not-allowed",
              fontSize: "1rem",
              padding: "14px 32px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            💳 Proceed to Payment · ₹{total || "0"}
          </button>
          {!canProceed && (
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
