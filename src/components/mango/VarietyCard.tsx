 import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveImage } from "./ResponsiveImage";
import { parsePrice, useCart } from "@/lib/cart";

export type Variety = {
  name: string;
  bangla: string;
  price: string;
  description: string;
  image: string;
  base: string;
};

export function VarietyCard({ variety }: { variety: Variety }) {
  const { addItem } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-35px_rgba(45,80,22,0.6)]">
      <div className="overflow-hidden bg-accent/60">
        <ResponsiveImage
          base={variety.base}
          fallback={variety.image}
          alt={`${variety.bangla} আম — fresh ${variety.name} mangoes`}
          width={1024}
          height={1024}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-secondary">
            {variety.name}{" "}
            <span className="text-sm font-normal text-muted-foreground">{variety.bangla}</span>
          </h3>
          <span className="shrink-0 font-semibold text-mango-deep">{variety.price}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {variety.description}
        </p>
        <button
          onClick={() => {
            addItem({
              id: variety.base,
              name: variety.name,
              bangla: variety.bangla,
              price: parsePrice(variety.price),
              image: variety.image,
            });
            toast.success(`${variety.name} added to cart`);
          }}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-mango hover:text-primary-foreground"
        >
          <ShoppingCart className="size-4" /> Add to Cart
        </button>
      </div>
    </article>
  );
}