import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/ippbx/Navbar";
import { Hero } from "@/components/ippbx/Hero";
import { Stats } from "@/components/ippbx/Stats";
import { OfferBanner } from "@/components/ippbx/OfferBanner";
import { TrialFeatures } from "@/components/ippbx/TrialFeatures";
import { Footer } from "@/components/ippbx/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ITFair IPPBX — কল সেন্টার IPPBX সলিউশন | ৩ দিন ফ্রি ট্রায়াল" },
      {
        name: "description",
        content:
          "WooCommerce প্লাগিন, ভয়েস মার্কেটিং, SMS মার্কেটিং, অর্ডার ভেরিফাই, IVR ও কল রেকর্ডিং — সব সুবিধা এক প্ল্যাটফর্মে। ০৳ এ শুরু করুন, ৩ দিন ফ্রি ট্রায়াল।",
      },
      { property: "og:title", content: "ITFair IPPBX — কল সেন্টার IPPBX সলিউশন" },
      {
        property: "og:description",
        content:
          "১ মাস সার্ভিস চার্জ ফ্রি, ফ্রি IP নাম্বার ও ফ্রি IVR ভয়েস রেকর্ডিং সহ সম্পূর্ণ IPPBX সলিউশন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <OfferBanner />
        <TrialFeatures />
      </main>
      <Footer />
    </div>
  );
}
