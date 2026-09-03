import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/mango/Navbar";
import { Hero } from "@/components/mango/Hero";
import { Varieties } from "@/components/mango/Varieties";
import { BannerBuilder } from "@/components/mango/BannerBuilder";
import { WhyChooseUs } from "@/components/mango/WhyChooseUs";
import { Testimonials } from "@/components/mango/Testimonials";
import { Newsletter } from "@/components/mango/Newsletter";
import { Footer } from "@/components/mango/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mango Fresh — Farm-Direct Mangoes Delivered to Your Door" },
      {
        name: "description",
        content:
          "Hand-picked Alphonso, Langra, Himsagar and Fazli mangoes shipped within 24 hours of harvest. Build your own mango promo banner in seconds.",
      },
      { property: "og:title", content: "Mango Fresh — Farm-Direct Mangoes" },
      {
        property: "og:description",
        content:
          "Naturally ripened, farm-direct mangoes delivered fresh, plus a free mango banner builder.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Hero />
        <Varieties />
        <BannerBuilder />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
