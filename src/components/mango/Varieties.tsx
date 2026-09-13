import { Reveal } from "./Reveal";
import { VarietyCard, type Variety } from "./VarietyCard";
import alphonso from "@/assets/mango-alphonso.jpg";
import langra from "@/assets/mango-langra.jpg";
import himsagar from "@/assets/mango-himsagar.jpg";
import fazli from "@/assets/mango-fazli.jpg";
import amrapali from "@/assets/mango-amrapali.jpg";
import gopalbhog from "@/assets/mango-gopalbhog.jpg";
import slicedPlate from "@/assets/mango-stack.jpg";

const varieties: Variety[] = [
  {
    name: "Alphonso",
    bangla: "আলফানসো",
    price: "৳1,250 / কেজি",
    description: "সোনালী রঙের, মাখনের মতো নরম এবং তীব্র সুগন্ধি — আমের রাজা।",
    image: alphonso,
    base: "mango-alphonso",
  },
  {
    name: "Langra",
    bangla: "ল্যাংড়া",
    price: "৳780 / কেজি",
    description: "সবুজ ত্বকে ফাইবারবিহীন, টক-মিষ্টি টিস্যু। বর্ষাকালের ঐতিহ্য।",
    image: langra,
    base: "mango-langra",
  },
  {
    name: "Himsagar",
    bangla: "হিমসাগর",
    price: "৳950 / কেজি",
    description: "সিল্কি, বীজবিহীন সরু শাঁস এবং মধুর স্বাদ। ডেজার্টের জন্য আদর্শ।",
    image: himsagar,
    base: "mango-himsagar",
  },
  {
    name: "Fazli",
    bangla: "ফজলি",
    price: "৳620 / কেজি",
    description: "বড়, উদার ফল মৃদু মিষ্টিতে — আচার ও ভাগ করে খাওয়ার জন্য শ্রেষ্ঠ।",
    image: fazli,
    base: "mango-fazli",
  },
  {
    name: "Amrapali",
    bangla: "আম্রপালি",
    price: "৳840 / কেজি",
    description: "গভীর কমলা রঙের মাংসল অংশ, প্রচুর ক্যারোটিন এবং মৌসুমের শেষে চিনির ঝাঁক।",
    image: amrapali,
    base: "mango-amrapali",
  },
  {
    name: "Gopalbhog",
    bangla: "গোপালভোগ",
    price: "৳890 / কেজি",
    description: "মৌসুমের প্রথম আম, ফুলের সুগন্ধি এবং নরম গলনশীল গঠন।",
    image: gopalbhog,
    base: "mango-gopalbhog",
  },
];

export function Varieties() {
  return (
    <section id="varieties" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="max-w-xl backdrop-blur-sm bg-white/30 rounded-2xl p-6 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mango-deep drop-shadow-sm">
              আমাদের জাত
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl drop-shadow-sm">
              ছয় ফসল, এক স্বাদের প্রতি নেশা
            </h2>
            <p className="mt-3 text-secondary/90 font-medium drop-shadow-sm">
              প্রতি বাক্স হাতে বাছাই করা এবং গাছ ছাড়ার দিনই প্যাক করা হয়
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <figure className="mt-10 overflow-hidden rounded-3xl border border-border/50 shadow-xl">
            <img
              src={slicedPlate}
              alt="স্তূপ করে সাজানো তাজা পাকা আম — A natural stack of freshly harvested ripe mangoes with leaves"
              width={1280}
              height={853}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full object-cover"
            />
            <figcaption className="bg-card px-6 py-4 text-sm font-medium text-muted-foreground">
              গাছ পাকা আম, হাতে বাছাই করা — প্রতিটি টুকরোয় মৌসুমের আসল স্বাদ।
            </figcaption>
          </figure>
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
