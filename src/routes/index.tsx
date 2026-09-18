import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Layers,
  LogIn,
  Package,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ইনভেন্টরি ম্যানেজমেন্ট — ফিল্ম রোল ও গ্রানুল স্টক" },
      {
        name: "description",
        content:
          "প্লাস্টিক প্যাকেজিং ব্যবসার জন্য Supabase-ভিত্তিক ইনভেন্টরি ম্যানেজমেন্ট — ফিল্ম রোল (BOPP/CPP/PP) এবং গ্রানুল (ডানা) স্টক আলাদা মডিউলে ট্র্যাক করুন।",
      },
      { property: "og:title", content: "ইনভেন্টরি ম্যানেজমেন্ট — ফিল্ম রোল ও গ্রানুল স্টক" },
      {
        property: "og:description",
        content:
          "দুটি স্বাধীন মডিউল: ফিল্ম রোল স্টক ও গ্রানুল স্টক। স্টাফ লগইন, এন্ট্রি অডিট ট্র্যাকিং এবং ডাইনামিক রিপোর্ট সহ।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const modules = [
  {
    title: "মডিউল ১ — ফিল্ম রোল",
    description:
      "BOPP, CPP ও PP রোলের ইনকামিং ও আউটগোয়িং এন্ট্রি। সাইজ ও মাইক্রন অনুযায়ী অ্যাগ্রিগেটেড স্টক।",
    icon: Layers,
    href: "/rolls" as const,
    points: [
      "রোল টাইপ, সাইজ, মাইক্রন, ওজন, সাপ্লায়ার ও তারিখ",
      "সাইজ + মাইক্রন অনুযায়ী স্বয়ংক্রিয় স্টক টোটাল",
      "রোল টাইপ, সাইজ, মাইক্রন ও তারিখ দিয়ে ফিল্টার",
    ],
  },
  {
    title: "মডিউল ২ — গ্রানুল / ডানা",
    description:
      "গ্রেড ও ব্যাচ অনুযায়ী কাঁচামাল ডানার ইনকামিং এবং মেশিন/লাইনভিত্তিক আউটগোয়িং।",
    icon: Package,
    href: "/granules" as const,
    points: [
      "গ্রেড, ব্যাচ, সাপ্লায়ার, ওজন ও তারিখ",
      "আউটগোয়িংয়ে মেশিন / প্রোডাকশন লাইন অপশন",
      "গ্রেড + ব্যাচ অনুযায়ী আলাদা স্টক লিস্ট",
    ],
  },
];

function Index() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border/60 bg-card/40">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Warehouse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              ইনভেন্টরি ম্যানেজার
            </span>
          </div>
          <nav aria-label="প্রধান নেভিগেশন" className="flex items-center gap-2">
            {loading ? null : user ? (
              <Button asChild size="sm">
                <Link to="/dashboard">
                  ড্যাশবোর্ড
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  স্টাফ লগইন
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Badge variant="secondary" className="mb-4">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Supabase ব্যাকএন্ড · স্টাফ অডিট ট্র্যাকিং
            </Badge>
            <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              প্লাস্টিক প্যাকেজিং ব্যবসার সম্পূর্ণ ইনভেন্টরি নিয়ন্ত্রণ
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              ফিল্ম রোল এবং গ্রানুল — দুটি সম্পূর্ণ আলাদা মডিউলে স্টক, এন্ট্রি ও রিপোর্ট পরিচালনা
              করুন। প্রতিটি এন্ট্রিতে কে যোগ করেছেন তা স্বয়ংক্রিয়ভাবে রেকর্ড হয়।
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to={user ? "/dashboard" : "/login"}>
                  {user ? "ড্যাশবোর্ডে যান" : "লগইন করে শুরু করুন"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/rolls">
                  <Boxes className="h-4 w-4" aria-hidden="true" />
                  ফিল্ম রোল স্টক দেখুন
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          aria-label="ইনভেন্টরি মডিউল"
          className="border-t border-border/60 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              দুটি স্বাধীন মডিউল
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              প্রতিটি মডিউলের ডেটা, স্টক টোটাল ও রিপোর্ট সম্পূর্ণ আলাদা — কোনোভাবেই একসাথে মেশে না।
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Card key={module.title} className="flex flex-col">
                    <CardHeader>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <CardTitle className="mt-3 font-display text-xl">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-6">
                      <ul className="space-y-2.5 text-sm text-muted-foreground">
                        {module.points.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <ClipboardList
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link to={module.href}>
                          মডিউল খুলুন
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>ইনভেন্টরি ম্যানেজার — ফিল্ম রোল ও গ্রানুল স্টক ট্র্যাকিং।</p>
          <p>স্টাফ অ্যাকাউন্ট ২–৩ জনের জন্য অনুমোদিত।</p>
        </div>
      </footer>
    </div>
  );
}
