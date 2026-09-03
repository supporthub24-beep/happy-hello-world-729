import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
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
};

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
