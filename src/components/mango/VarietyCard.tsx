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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(45,80,22,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-[0_24px_64px_rgba(45,80,22,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]">
      {/* Liquid glass gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-orange-100/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/40 to-orange-50/30">
        <ResponsiveImage
          base={variety.base}
          fallback={variety.image}
          alt={`${variety.bangla} আম — fresh ${variety.name} mangoes`}
          width={1024}
          height={1024}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Glass reflection effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      
      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-secondary">
            {variety.name}{" "}
            <span className="text-sm font-normal text-muted-foreground/80">{variety.bangla}</span>
          </h3>
          <span className="shrink-0 rounded-full bg-mango/10 px-3 py-1 font-semibold text-mango-deep backdrop-blur-sm">
            {variety.price}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground/90">
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
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mango/90 to-orange-500/90 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.25),0_0_0_1px_rgba(255,255,255,0.2)_inset] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_24px_rgba(234,88,12,0.35),0_0_0_1px_rgba(255,255,255,0.3)_inset] hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShoppingCart className="size-4" /> Add to Cart
        </button>
      </div>
    </article>
  );
}
