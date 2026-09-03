// Maps an asset base name (e.g. "mango-alphonso") to a WebP srcset string
// built from the pre-generated variants in src/assets/responsive.

const modules = import.meta.glob("../assets/responsive/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byBase = new Map<string, { width: number; url: string }[]>();

for (const [path, url] of Object.entries(modules)) {
  const file = path.split("/").pop()!.replace(".webp", "");
  const match = file.match(/^(.*)-(\d+)$/);
  if (!match) continue;
  const base = match[1]!;
  const width = match[2]!;
  const list = byBase.get(base) ?? [];
  list.push({ width: Number(width), url });
  byBase.set(base, list);
}

for (const list of byBase.values()) list.sort((a, b) => a.width - b.width);

export function webpSrcSet(base: string): string | undefined {
  const list = byBase.get(base);
  if (!list?.length) return undefined;
  return list.map((v) => `${v.url} ${v.width}w`).join(", ");
}
