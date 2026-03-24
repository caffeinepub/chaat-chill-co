import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";

const PRICES: Record<string, number> = {
  "PANI PURI": 30,
  "DAHI PURI": 50,
  "COLD COFFEE": 70,
  "ICED TEA": 35,
  "Quick Chill Combo": 59,
  "Creamy Treat Combo": 75,
  "Classic Chaat Combo": 69,
  "Chill & Thrill Combo": 89,
  "Premium Indulgence": 105,
  "⭐ Full Feast": 99,
  "👑 Ultimate Combo": 95,
  "🧃 Beverage Blast": 139,
};

interface Order {
  orderId: bigint;
  customerName: string;
  phoneNumber: string;
  items: Array<{ itemName: string; quantity: bigint }>;
  timestamp: bigint;
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatItems(
  items: Array<{ itemName: string; quantity: bigint }>,
): string {
  return items
    .filter((it) => it.quantity > 0n)
    .map((it) => `${it.itemName} x${it.quantity}`)
    .join(", ");
}

function calcTotal(
  items: Array<{ itemName: string; quantity: bigint }>,
): number {
  return items.reduce(
    (sum, it) => sum + (PRICES[it.itemName] ?? 0) * Number(it.quantity),
    0,
  );
}

function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function downloadCSV(orders: Order[]) {
  const headers = ["Order #", "Name", "Phone", "Items", "Total (Rs)", "Time"];
  const rows = orders.map((o) => [
    Number(o.orderId),
    o.customerName,
    o.phoneNumber,
    formatItems(o.items),
    calcTotal(o.items),
    formatTime(o.timestamp),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chaat-chill-orders.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const { actor, isFetching } = useActor();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getAllOrders()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          Number(b.timestamp - a.timestamp),
        );
        setOrders(sorted as Order[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, [actor, isFetching]);

  return (
    <div
      style={{
        background: "#0B0A08",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        color: "#F3F1ED",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(226,154,58,0.15)",
          background: "#0F0D0A",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <button
          type="button"
          onClick={goHome}
          data-ocid="admin.secondary_button"
          style={{
            background: "rgba(26,21,16,0.85)",
            border: "1px solid rgba(226,154,58,0.3)",
            borderRadius: 50,
            color: "#E29A3A",
            fontSize: "0.85rem",
            fontWeight: 600,
            padding: "8px 18px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>

        <div style={{ textAlign: "center", flex: 1 }}>
          <span
            className="brand-gradient"
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              letterSpacing: "0.12em",
            }}
          >
            CHAAT &amp; CHILL CO.
          </span>
          <span
            style={{
              display: "block",
              color: "#6B6460",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              marginTop: "2px",
            }}
          >
            ADMIN · PRE-ORDERS
          </span>
        </div>

        <button
          type="button"
          onClick={() => downloadCSV(orders)}
          data-ocid="admin.primary_button"
          disabled={orders.length === 0}
          style={{
            background:
              orders.length > 0
                ? "linear-gradient(135deg, #D8842F, #F2C15B)"
                : "rgba(60,50,35,0.5)",
            border: "none",
            borderRadius: 50,
            color: orders.length > 0 ? "#0B0A08" : "#6B6460",
            fontSize: "0.85rem",
            fontWeight: 700,
            padding: "8px 20px",
            cursor: orders.length > 0 ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          📥 Download CSV
        </button>
      </div>

      {/* Main content */}
      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
        {loading && (
          <div
            data-ocid="admin.loading_state"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              padding: "5rem",
              color: "#6B6460",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                border: "2px solid rgba(226,154,58,0.3)",
                borderTopColor: "#E29A3A",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
            Loading orders...
          </div>
        )}

        {error && (
          <div
            data-ocid="admin.error_state"
            style={{
              background: "rgba(220,60,60,0.12)",
              border: "1px solid rgba(220,60,60,0.4)",
              borderRadius: 12,
              padding: "1.5rem",
              color: "#E88",
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="admin.empty_state"
            style={{
              textAlign: "center",
              padding: "6rem 2rem",
              color: "#6B6460",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <p style={{ fontSize: "1.1rem" }}>No orders yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.4rem" }}>
              Pre-orders will appear here once customers place them.
            </p>
          </motion.div>
        )}

        {!loading && !error && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#F3F1ED",
                }}
              >
                {orders.length} Order{orders.length !== 1 ? "s" : ""}
              </h2>
              <span
                style={{
                  color: "#E29A3A",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Total Revenue: ₹
                {orders.reduce((s, o) => s + calcTotal(o.items), 0)}
              </span>
            </div>

            <div
              style={{
                overflowX: "auto",
                borderRadius: 16,
                border: "1px solid rgba(226,154,58,0.2)",
              }}
              data-ocid="admin.table"
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.88rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#1a1510",
                      borderBottom: "1px solid rgba(226,154,58,0.25)",
                    }}
                  >
                    {[
                      "Order #",
                      "Name",
                      "Phone",
                      "Items",
                      "Total (₹)",
                      "Time",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.85rem 1.1rem",
                          textAlign: "left",
                          color: "#E29A3A",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={String(order.orderId)}
                      data-ocid={`admin.row.${idx + 1}`}
                      style={{
                        borderBottom: "1px solid rgba(226,154,58,0.1)",
                        background: idx % 2 === 0 ? "#0F0D0A" : "#0B0A08",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = "rgba(226,154,58,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background =
                          idx % 2 === 0 ? "#0F0D0A" : "#0B0A08";
                      }}
                    >
                      <td
                        style={{
                          padding: "0.85rem 1.1rem",
                          color: "#F2C15B",
                          fontWeight: 700,
                        }}
                      >
                        #{Number(order.orderId)}
                      </td>
                      <td
                        style={{ padding: "0.85rem 1.1rem", color: "#F3F1ED" }}
                      >
                        {order.customerName}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1.1rem",
                          color: "#B9B3AA",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.phoneNumber}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1.1rem",
                          color: "#B9B3AA",
                          maxWidth: 260,
                        }}
                      >
                        {formatItems(order.items)}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1.1rem",
                          color: "#F2C15B",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹{calcTotal(order.items)}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1.1rem",
                          color: "#6B6460",
                          whiteSpace: "nowrap",
                          fontSize: "0.8rem",
                        }}
                      >
                        {formatTime(order.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
