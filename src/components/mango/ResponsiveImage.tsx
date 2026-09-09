 import { webpSrcSet } from "@/lib/responsive-images";

type Props = {
  /** Base file name without extension, e.g. "mango-alphonso" */
  base: string;
  /** Original JPG import used as the fallback source */
  fallback: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export function ResponsiveImage({
  base,
  fallback,
  alt,
  width,
  height,
  sizes,
  className,
  loading = "lazy",
  fetchPriority = "auto",
}: Props) {
  const srcSet = webpSrcSet(base);

  return (
    <picture>
      {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding={loading === "eager" ? "sync" : "async"}
        fetchPriority={fetchPriority}
        className={className}
      />
    </picture>
  );
}