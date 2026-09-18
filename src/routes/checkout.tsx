import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Navbar } from "@/components/mango/Navbar";
import { Footer } from "@/components/mango/Footer";
import { formatBDT, useCart } from "@/lib/cart";
import { DELIVERY_FEE, FREE_DELIVERY_OVER } from "./cart";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

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
  const { user, loading: authLoading } = useAuth();
  const [method, setMethod] = useState<"cod" | "bkash" | "bank">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("অর্ডার করতে লগইন করুন");
      void navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      toast.error("অর্ডার করতে লগইন করুন");
      void navigate({ to: "/login" });
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!isSupabaseConfigured) {
      toast.error(
        "Supabase কনফিগার করা নেই। VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY সেট করুন।",
      );
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

        {!isSupabaseConfigured ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
          >
            <p className="font-semibold">Supabase কনফিগার করা নেই</p>
            <p className="mt-1">
              <code className="font-mono text-xs">VITE_SUPABASE_URL</code> এবং{" "}
              <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> সেট করার পর
              অর্ডার নিশ্চিত করা যাবে।
            </p>
          </div>
        ) : null}

        {authLoading ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">লোড হচ্ছে…</p>
          </div>
        ) : !user ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              অর্ডার সম্পন্ন করতে লগইন করুন — Please sign in to place your order.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
            >
              লগইন করুন
            </Link>
          </div>
        ) : items.length === 0 ? (
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
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 text-sm">
                    <input
                      type="radio"
                      name="method"
                      checked={method === "bank"}
                      onChange={() => setMethod("bank")}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold text-secondary">Bank Transfer</span>
                      <span className="block text-muted-foreground">
                        ব্যাঙ্ক কার্ড দিয়ে নিরাপদ পেমেন্ট।
                      </span>
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
                disabled={submitting || !isSupabaseConfigured || !user}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    toast.error("অর্ডার করতে লগইন করুন");
                    void navigate({ to: "/login" });
                    return;
                  }
                  if (!isSupabaseConfigured) {
                    e.preventDefault();
                    toast.error(
                      "Supabase কনফিগার করা নেই। VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY সেট করুন।",
                    );
                    return;
                  }
                  if (method === "bank") {
                    e.preventDefault();
                    setShowBankModal(true);
                  }
                }}
                className="mt-6 w-full rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {method === "bank" ? "Pay with Bank" : "Place order"}
              </button>
            </aside>
          </form>
        )}
      </main>
      <Footer />

      {showBankModal && (
        <BankPaymentModal
          total={total}
          onClose={() => setShowBankModal(false)}
          onSuccess={() => {
            setSubmitting(true);
            const form = document.querySelector("form");
            if (form) {
              const formData = new FormData(form as HTMLFormElement);
              const order = {
                id: `MF-${Date.now().toString().slice(-6)}`,
                name: String(formData.get("name") ?? ""),
                phone: String(formData.get("phone") ?? ""),
                address: String(formData.get("address") ?? ""),
                note: String(formData.get("note") ?? ""),
                status: "প্রস্তুত করা হচ্ছে" as const,
                statusSteps: [
                  { name: "অর্ডার গৃহীত", done: true, time: new Date().toISOString() },
                  { name: "প্রস্তুত করা হচ্ছে", done: true, time: new Date().toISOString() },
                  { name: "পাঠানো হয়েছে", done: false },
                  { name: "ডেলিভারি হয়েছে", done: false },
                ] as const,
                method: "bank" as const,
                trxId: `BANK-${Date.now().toString().slice(-8)}`,
                total,
                items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, id: i.id })),
                createdAt: new Date().toISOString(),
              };
              localStorage.setItem("mango-fresh-last-order", JSON.stringify(order));
              clear();
              navigate({ to: "/order-confirmed" });
            }
          }}
        />
      )}
    </div>
  );
}

function BankPaymentModal({
  total,
  onClose,
  onSuccess,
}: {
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"card" | "otp" | "processing" | "success">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [otp, setOtp] = useState("");

  const isValidCard = cardNumber.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length === 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-secondary">Bank Payment</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent"
          >
            ✕
          </button>
        </div>

        {step === "card" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  setCardNumber(v.replace(/(\d{4})(?=\d)/g, "$1 "));
                }}
                placeholder="1234 5678 9012 3456"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length >= 2) {
                      setExpiry(`${v.slice(0, 2)}/${v.slice(2)}`);
                    } else {
                      setExpiry(v);
                    }
                  }}
                  placeholder="MM/YY"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="123"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-mango/10 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount to pay:</span>
                <span className="font-semibold text-mango-deep">{formatBDT(total)}</span>
              </div>
            </div>
            <button
              onClick={() => isValidCard && setStep("otp")}
              disabled={!isValidCard}
              className="w-full rounded-full bg-secondary py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              Proceed to OTP
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              একটি ওটিপি আপনার মোবাইলে পাঠানো হয়েছে (ডেমো: 123456)
            </p>
            <div>
              <label className="text-sm font-medium text-secondary">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className={inputClass}
              />
            </div>
            <button
              onClick={() => {
                if (otp === "123456") {
                  setStep("processing");
                  setTimeout(() => {
                    setStep("success");
                    setTimeout(onSuccess, 800);
                  }, 1500);
                } else {
                  toast.error("Invalid OTP. Try 123456");
                }
              }}
              disabled={otp.length !== 6}
              className="w-full rounded-full bg-secondary py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              Verify & Pay
            </button>
          </div>
        )}

        {(step === "processing" || step === "success") && (
          <div className="mt-8 flex flex-col items-center justify-center py-8">
            <div className={`h-16 w-16 rounded-full ${step === "success" ? "bg-green-500" : "bg-mango"} flex items-center justify-center`}>
              {step === "processing" ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className="mt-4 text-sm font-medium text-secondary">
              {step === "processing" ? "Processing transaction..." : "Payment successful!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
