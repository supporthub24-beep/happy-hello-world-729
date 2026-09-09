 import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Navbar } from "@/components/mango/Navbar";
import { Footer } from "@/components/mango/Footer";
import { formatBDT, useCart } from "@/lib/cart";
import { DELIVERY_FEE, FREE_DELIVERY_OVER } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Mango Fresh" },
      {
        name: "description",
        content:
          "Enter your delivery details and pay with cash on delivery or bKash to complete your mango order.",
      },
      { property: "og:title", content: "Checkout — Mango Fresh" },
      {
        property: "og:description",
        content: "Complete your farm-direct mango order with cash on delivery or bKash.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const inputClass =
  "mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-mango";

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"cod" | "bkash">("cod");
  const [submitting, setSubmitting] = useState(false);

  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const form = new FormData(e.currentTarget);
    if (method === "bkash" && !String(form.get("trxId") ?? "").trim()) {
      toast.error("bKash Transaction ID দিন");
      return;
    }
    setSubmitting(true);
    const order = {
      id: `MF-${Date.now().toString().slice(-6)}`,
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      note: String(form.get("note") ?? ""),
      status: "প্রস্তুত করা হচ্ছে" as const,
      statusSteps: [
        { name: "অর্ডার গৃহীত", done: true, time: new Date().toISOString() },
        { name: "প্রস্তুত করা হচ্ছে", done: true, time: new Date().toISOString() },
        { name: "পাঠানো হয়েছে", done: false },
        { name: "ডেলিভারি হয়েছে", done: false },
      ] as const,
      method,
      trxId: String(form.get("trxId") ?? ""),
      total,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, id: i.id })),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("mango-fresh-last-order", JSON.stringify(order));
    clear();
    navigate({ to: "/order-confirmed" });
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-28">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
          Checkout <span className="text-lg font-normal text-muted-foreground">চেকআউট</span>
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Your cart is empty — কার্ট খালি।</p>
            <Link
              to="/cart"
              className="mt-6 inline-block rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
            >
              Go to cart
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Delivery details
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    Full name
                    <input name="name" required className={inputClass} placeholder="আপনার নাম" />
                  </label>
                  <label className="text-sm">
                    Phone
                    <input
                      name="phone"
                      required
                      type="tel"
                      pattern="[0-9+\- ]{6,}"
                      className={inputClass}
                      placeholder="01XXXXXXXXX"
                    />
                  </label>
                  <label className="text-sm sm:col-span-2">
                    Address
                    <textarea
                      name="address"
                      required
                      rows={3}
                      className={inputClass}
                      placeholder="বাসা, রোড, এলাকা, শহর"
                    />
                  </label>
                  <label className="text-sm sm:col-span-2">
                    Note (optional)
                    <input name="note" className={inputClass} placeholder="ডেলিভারি সংক্রান্ত নোট" />
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold text-secondary">Payment method</h2>
                <div className="mt-4 space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 text-sm">
                    <input
                      type="radio"
                      name="method"
                      checked={method === "cod"}
                      onChange={() => setMethod("cod")}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold text-secondary">Cash on Delivery</span>
                      <span className="block text-muted-foreground">
                        পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
                      </span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 text-sm">
                    <input
                      type="radio"
                      name="method"
                      checked={method === "bkash"}
                      onChange={() => setMethod("bkash")}
                      className="mt-1"
                    />
                    <span className="flex-1">
                      <span className="font-semibold text-secondary">bKash (manual)</span>
                      <span className="block text-muted-foreground">
                        01700-000000 নম্বরে Send Money করে Transaction ID দিন।
                      </span>
                      {method === "bkash" && (
                        <input
                          name="trxId"
                          className={inputClass}
                          placeholder="bKash Transaction ID"
                        />
                      )}
                    </span>
                  </label>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-secondary">Order summary</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {i.name} × {i.qty}
                    </span>
                    <span className="font-medium">{formatBDT(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-medium">{delivery === 0 ? "Free" : formatBDT(delivery)}</dd>
                </div>
                <div className="flex justify-between text-base">
                  <dt className="font-semibold text-secondary">Total</dt>
                  <dd className="font-semibold text-mango-deep">{formatBDT(total)}</dd>
                </div>
              </dl>
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                Place order
              </button>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}