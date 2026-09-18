import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Navbar } from "@/components/mango/Navbar";
import { Footer } from "@/components/mango/Footer";
import { formatBDT, useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Mango Fresh" },
      {
        name: "description",
        content: "Review the mangoes in your cart, adjust quantities and continue to checkout.",
      },
      { property: "og:title", content: "Your Cart — Mango Fresh" },
      {
        property: "og:description",
        content: "Review your farm-direct mango order before checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

export const DELIVERY_FEE = 80;
export const FREE_DELIVERY_OVER = 2000;

function CartPage() {
  const { items, subtotal, setQty, removeItem } = useCart();
  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-28">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
          Your Cart <span className="text-lg font-normal text-muted-foreground">আপনার কার্ট</span>
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border bg-card p-12 text-center">
            <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your cart is empty — কার্ট এখনো খালি।</p>
            <Link
              to="/"
              hash="varieties"
              className="mt-6 inline-block rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
            >
              Browse mangoes
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-3xl border border-border bg-card p-4"
                >
                  <img
                    src={item.image}
                    alt={`${item.bangla} আম — ${item.name} mangoes`}
                    className="size-24 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-semibold text-secondary">
                        {item.name}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          {item.bangla}
                        </span>
                      </h2>
                      <button
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatBDT(item.price)} / kg</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="rounded-full p-1 text-secondary hover:bg-accent"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="rounded-full p-1 text-secondary hover:bg-accent"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <span className="font-semibold text-mango-deep">
                        {formatBDT(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-secondary">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{formatBDT(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-medium">{delivery === 0 ? "Free" : formatBDT(delivery)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold text-secondary">Total</dt>
                  <dd className="font-semibold text-mango-deep">{formatBDT(subtotal + delivery)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 block rounded-full bg-secondary px-6 py-3 text-center text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5"
              >
                Proceed to checkout
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                ৳2,000+ অর্ডারে ডেলিভারি ফ্রি
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
