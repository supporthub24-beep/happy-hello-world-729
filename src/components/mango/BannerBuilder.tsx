import { useRef, useState } from "react";
import { Download, ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import heroMangoes from "@/assets/hero-mangoes.jpg";
import orchard from "@/assets/banner-orchard.jpg";
import alphonso from "@/assets/mango-alphonso.jpg";
import himsagar from "@/assets/mango-himsagar.jpg";

const templates = [
  { id: "split", label: "Split" },
  { id: "overlay", label: "Overlay" },
  { id: "minimal", label: "Minimal" },
] as const;

type TemplateId = (typeof templates)[number]["id"];

const themes = [
  { id: "sunrise", label: "Sunrise", bg: "#FF8C00", accent: "#FFF8E7", text: "#2D2003" },
  { id: "orchard", label: "Orchard", bg: "#2D5016", accent: "#FFA500", text: "#FFF8E7" },
  { id: "cream", label: "Cream", bg: "#FFF8E7", accent: "#FF8C00", text: "#2D5016" },
  { id: "midnight", label: "Midnight", bg: "#241C0B", accent: "#FFA500", text: "#FFF8E7" },
];

const gallery = [
  { src: heroMangoes, label: "Harvest pile" },
  { src: orchard, label: "Orchard" },
  { src: alphonso, label: "Alphonso" },
  { src: himsagar, label: "Sliced" },
];

export function BannerBuilder() {
  const [template, setTemplate] = useState<TemplateId>("split");
  const [headline, setHeadline] = useState("Mango Season Is Here");
  const [subtext, setSubtext] = useState("Farm-fresh Alphonso · 20% off this week only");
  const [themeId, setThemeId] = useState("sunrise");
  const [image, setImage] = useState<string>(heroMangoes);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const theme = themes.find((t) => t.id === themeId) ?? themes[0]!;

  const handleUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const download = async () => {
    if (!canvasRef.current) return;
    setBusy(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: theme.bg,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "mango-fresh-banner.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Banner downloaded");
    } catch {
      toast.error("Could not export the banner. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const labelCls = "text-xs font-semibold uppercase tracking-widest text-muted-foreground";
  const inputCls =
    "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-mango focus:ring-2 focus:ring-mango/30";

  return (
    <section id="banner-builder" className="bg-accent/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-mango-deep">
              <Sparkles className="size-4" /> Banner Builder
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
              Design your own mango promo banner
            </h2>
            <p className="mt-3 text-muted-foreground">
              Pick a layout, write your copy, choose a palette and export a print-ready PNG — all in
              your browser.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* Controls */}
          <div className="rounded-3xl border border-border bg-card p-6">
            <div>
              <span className={labelCls}>Template</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      template === t.id
                        ? "border-mango bg-mango text-primary-foreground"
                        : "border-border hover:border-mango/60"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className={labelCls} htmlFor="bb-headline">
                Headline
              </label>
              <input
                id="bb-headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className={inputCls}
                maxLength={48}
              />
            </div>

            <div className="mt-5">
              <label className={labelCls} htmlFor="bb-subtext">
                Subtext
              </label>
              <textarea
                id="bb-subtext"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                rows={2}
                className={inputCls}
                maxLength={90}
              />
            </div>

            <div className="mt-6">
              <span className={labelCls}>Color theme</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    aria-label={t.label}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                      themeId === t.id ? "border-mango" : "border-border"
                    }`}
                  >
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ background: t.bg }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <span className={labelCls}>Image</span>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {gallery.map((g) => (
                  <button
                    key={g.label}
                    onClick={() => setImage(g.src)}
                    aria-label={g.label}
                    className={`overflow-hidden rounded-xl border-2 transition-colors ${
                      image === g.src ? "border-mango" : "border-transparent"
                    }`}
                  >
                    <img
                      src={g.src}
                      alt={g.label}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-mango hover:text-mango-deep">
                <ImagePlus className="size-4" />
                Upload your own
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            <button
              onClick={download}
              disabled={busy}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Download className="size-4" />
              {busy ? "Exporting…" : "Download Banner"}
            </button>
          </div>

          {/* Live preview */}
          <div className="self-start rounded-3xl border border-border bg-card p-4 sm:p-6">
            <p className={labelCls}>Live preview</p>
            <div className="mt-3 overflow-hidden rounded-2xl">
              <div
                ref={canvasRef}
                className="flex aspect-[16/9] w-full overflow-hidden"
                style={{ background: theme.bg, color: theme.text }}
              >
                {template === "split" && (
                  <>
                    <div className="flex flex-1 flex-col justify-center gap-2 p-[5%]">
                      <p
                        className="text-[2.6vw] font-semibold uppercase tracking-[0.25em] sm:text-[0.9vw]"
                        style={{ color: theme.accent }}
                      >
                        Mango Fresh
                      </p>
                      <h3 className="font-display text-[5vw] leading-tight font-semibold lg:text-[2.4vw]">
                        {headline}
                      </h3>
                      <p className="text-[2.6vw] opacity-80 lg:text-[1.1vw]">{subtext}</p>
                    </div>
                    <div className="w-[42%] shrink-0">
                      <img src={image} alt="Banner" className="size-full object-cover" />
                    </div>
                  </>
                )}

                {template === "overlay" && (
                  <div className="relative size-full">
                    <img src={image} alt="Banner" className="size-full object-cover" />
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-[6%] text-center"
                      style={{ background: `${theme.bg}b3` }}
                    >
                      <p
                        className="text-[2.4vw] font-semibold uppercase tracking-[0.3em] lg:text-[0.9vw]"
                        style={{ color: theme.accent }}
                      >
                        Mango Fresh
                      </p>
                      <h3 className="font-display text-[5.4vw] leading-tight font-semibold lg:text-[2.6vw]">
                        {headline}
                      </h3>
                      <p className="text-[2.6vw] opacity-85 lg:text-[1.1vw]">{subtext}</p>
                    </div>
                  </div>
                )}

                {template === "minimal" && (
                  <div className="flex size-full flex-col justify-between p-[5%]">
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[2.4vw] font-semibold uppercase tracking-[0.3em] lg:text-[0.9vw]"
                        style={{ color: theme.accent }}
                      >
                        Mango Fresh
                      </p>
                      <img
                        src={image}
                        alt="Banner"
                        className="size-[12vw] rounded-full object-cover lg:size-[5vw]"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-[6vw] leading-tight font-semibold lg:text-[3vw]">
                        {headline}
                      </h3>
                      <div
                        className="my-[2%] h-px w-full"
                        style={{ background: theme.accent, opacity: 0.6 }}
                      />
                      <p className="text-[2.6vw] opacity-80 lg:text-[1.1vw]">{subtext}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Exports as a high-resolution PNG, ready for social posts or print.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
