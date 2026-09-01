import { Reveal } from "./Reveal";
import { VarietyCard, type Variety } from "./VarietyCard";
import alphonso from "@/assets/mango-alphonso.jpg";
import langra from "@/assets/mango-langra.jpg";
import himsagar from "@/assets/mango-himsagar.jpg";
import fazli from "@/assets/mango-fazli.jpg";
import amrapali from "@/assets/mango-amrapali.jpg";
import gopalbhog from "@/assets/mango-gopalbhog.jpg";

const varieties: Variety[] = [
  {
    name: "Alphonso",
    bangla: "আলফানসো",
    price: "৳1,250 / kg",
    description: "Saffron-hued, buttery and intensely aromatic — the king of mangoes.",
    image: alphonso,
  },
  {
    name: "Langra",
    bangla: "ল্যাংড়া",
    price: "৳780 / kg",
    description: "Green-skinned with a fibreless, tangy-sweet pulp. A monsoon classic.",
    image: langra,
  },
  {
    name: "Himsagar",
    bangla: "হিমসাগর",
    price: "৳950 / kg",
    description: "Silky, seedless-thin stone and honeyed flavour. Perfect for desserts.",
    image: himsagar,
  },
  {
    name: "Fazli",
    bangla: "ফজলি",
    price: "৳620 / kg",
    description: "Big, generous fruit with mellow sweetness — best for sharing and pickles.",
    image: fazli,
  },
  {
    name: "Amrapali",
    bangla: "আম্রপালি",
    price: "৳840 / kg",
    description: "Deep orange flesh, rich carotene and a late-season sugary punch.",
    image: amrapali,
  },
  {
    name: "Gopalbhog",
    bangla: "গোপালভোগ",
    price: "৳890 / kg",
    description: "Earliest of the season, floral aroma with a soft melting texture.",
    image: gopalbhog,
  },
];

export function Varieties() {
  return (
    <section id="varieties" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mango-deep">
              Our Varieties
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
              Six harvests, one obsession with flavour
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every crate is graded by hand and packed the same day it leaves the tree.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {varieties.map((v, i) => (
            <Reveal key={v.name} delay={i * 70} className="h-full">
              <VarietyCard variety={v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
