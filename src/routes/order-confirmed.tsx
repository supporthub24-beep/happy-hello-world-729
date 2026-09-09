 import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, CheckCheck } from "lucide-react";
import { Navbar } from "@/components/mango/Navbar";
import { Footer } from "@/components/mango/Footer";
import { formatBDT } from "@/lib/cart";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Mango Fresh" },
      {
        name: "description",
        content: "Your mango order has been placed. We will call you shortly to confirm delivery.",
      },
      { property: "og:title", content: "Order Confirmed — Mango Fresh" },
      {
        property: "og:description",
        content: "Thank you for ordering farm-direct mangoes from Mango Fresh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderConfirmedPage,
});

type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  method: "cod" | "bkash";
  trxId?: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  status?: "confirmed" | "preparing" | "shipped" | "delivered";
};

const serviceSteps = [
  { key: "confirmed", label: "অর্ডার কনফার্ম", icon: CheckCircle2 },
  { key: "preparing", label: "প্রস্তুত হচ্ছে", icon: Package },
  { key: "shipped", label: "পাঠানো হয়েছে", icon: Truck },
  { key: "delivered", label: "ডেলিভারি সম্পন্ন", icon: CheckCheck },
] as const;

function OrderConfirmedPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mango-fresh-last-order");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      /* ignore */
    }
  }, []);

  const currentStatus = order?.status ?? "confirmed";
  const currentStepIndex = serviceSteps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-28">
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-mango-deep" />
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-secondary">
            Order confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            ধন্যবাদ! আপনার অর্ডার গ্রহণ করা হয়েছে। আমরা শীঘ্রই ফোনে যোগাযোগ করব।
          </p>

          {order && (
            <div className="mt-8 rounded-2xl border border-border p-5 text-left text-sm">
              <p className="font-semibold text-secondary">Order #{order.id}</p>
              <ul className="mt-3 space-y-1">
                {order.items.map((i) => (
                  <li key={i.name} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {i.name} × {i.qty}
                    </span>
                    <span>{formatBDT(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                <span>Total</span>
                <span className="text-mango-deep">{formatBDT(order.total)}</span>
              </div>
              <p className="mt-3 text-muted-foreground">
                {order.method === "cod" ? "Cash on Delivery" : `bKash — TrxID ${order.trxId}`}
              </p>
              <p className="mt-1 text-muted-foreground">
                {order.name} · {order.phone}
              </p>
              <p className="text-muted-foreground">{order.address}</p>
            </div>
          )}

          <div className="mt-8">
            <p className="mb-4 text-sm font-medium text-secondary">Service Status</p>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <div
                  className="h-full bg-mango-deep transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (serviceSteps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {serviceSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                          isActive
                            ? "border-mango-deep bg-mango-deep text-white"
                            : "border-muted bg-background text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-mango-deep/20" : ""}`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium ${
                          isActive ? "text-secondary" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
          >
            Continue shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}