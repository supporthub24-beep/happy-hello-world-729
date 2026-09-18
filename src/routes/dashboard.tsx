import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Layers,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import {
  aggregateFilmRollStock,
  aggregateGranuleStock,
  fetchFilmRollMovements,
  fetchGranuleMovements,
  filmRollBreakdownByType,
  filmRollTotals,
  formatKg,
  granuleBreakdownByGrade,
  granuleTotals,
  type FilmRollMovement,
  type GranuleMovement,
} from "@/lib/inventory";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "ড্যাশবোর্ড — ইনভেন্টরি ম্যানেজার" },
      {
        name: "description",
        content:
          "ফিল্ম রোল ও গ্রানুল স্টকের সারসংক্ষেপ, রোল টাইপ ও গ্রেড অনুযায়ী ব্রেকডাউন এবং সর্বশেষ মুভমেন্ট এক নজরে দেখুন।",
      },
      { property: "og:title", content: "ড্যাশবোর্ড — ইনভেন্টরি ম্যানেজার" },
      {
        property: "og:description",
        content:
          "দুটি স্বাধীন মডিউলের স্টক সামারি ও ব্রেকডাউন — ফিল্ম রোল এবং গ্রানুল।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, configured, displayName, signOut } = useAuth();

  const [rolls, setRolls] = useState<FilmRollMovement[]>([]);
  const [granules, setGranules] = useState<GranuleMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      void navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user || !configured) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([fetchFilmRollMovements(), fetchGranuleMovements()])
      .then(([rollData, granuleData]) => {
        if (!active) return;
        setRolls(rollData);
        setGranules(granuleData);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "ডেটা লোড করা যায়নি।");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, configured, reloadKey]);

  const rollTotals = useMemo(() => filmRollTotals(rolls), [rolls]);
  const granuleTotal = useMemo(() => granuleTotals(granules), [granules]);
  const rollBreakdown = useMemo(() => filmRollBreakdownByType(rolls), [rolls]);
  const granuleBreakdown = useMemo(() => granuleBreakdownByGrade(granules), [granules]);
  const rollStock = useMemo(() => aggregateFilmRollStock(rolls), [rolls]);
  const granuleStock = useMemo(() => aggregateGranuleStock(granules), [granules]);

  const recentRolls = useMemo(() => rolls.slice(0, 5), [rolls]);
  const recentGranules = useMemo(() => granules.slice(0, 5), [granules]);

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/login" });
  }

  if (authLoading || (!user && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">লোড হচ্ছে</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border/60 bg-card/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Warehouse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              ইনভেন্টরি ম্যানেজার
            </span>
          </Link>
          <nav aria-label="প্রধান নেভিগেশন" className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link to="/rolls">
                <Layers className="h-4 w-4" aria-hidden="true" />
                ফিল্ম রোল
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/granules">
                <Package className="h-4 w-4" aria-hidden="true" />
                গ্রানুল
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              লগআউট
            </Button>
          </nav>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                ড্যাশবোর্ড
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                স্বাগতম, {displayName || "স্টাফ"} — দুটি মডিউলের সর্বশেষ স্টক অবস্থা।
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              রিফ্রেশ
            </Button>
          </div>

          {!configured ? (
            <Alert variant="destructive">
              <AlertTitle>Supabase কনফিগার করা নেই</AlertTitle>
              <AlertDescription>
                <code className="font-mono text-xs">VITE_SUPABASE_URL</code> এবং{" "}
                <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> সেট করার পর
                ড্যাশবোর্ডের ডেটা লোড হবে।
              </AlertDescription>
            </Alert>
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>ডেটা লোড করা যায়নি</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{error}</p>
                <Button size="sm" variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
                  আবার চেষ্টা করুন
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          <section aria-label="স্টক সামারি" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="ফিল্ম রোল স্টক"
              value={formatKg(rollTotals.balance)}
              icon={Layers}
              loading={loading}
              hint={`ইনকামিং ${formatKg(rollTotals.incoming)} · আউটগোয়িং ${formatKg(rollTotals.outgoing)}`}
            />
            <SummaryCard
              title="গ্রানুল স্টক"
              value={formatKg(granuleTotal.balance)}
              icon={Package}
              loading={loading}
              hint={`ইনকামিং ${formatKg(granuleTotal.incoming)} · আউটগোয়িং ${formatKg(granuleTotal.outgoing)}`}
            />
            <SummaryCard
              title="রোল স্টক লাইন"
              value={String(rollStock.length)}
              icon={Boxes}
              loading={loading}
              hint="সাইজ + মাইক্রন কম্বিনেশন"
            />
            <SummaryCard
              title="গ্রানুল স্টক লাইন"
              value={String(granuleStock.length)}
              icon={Boxes}
              loading={loading}
              hint="গ্রেড + ব্যাচ কম্বিনেশন"
            />
          </section>

          <section aria-label="মডিউল ব্রেকডাউন" className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">মডিউল ১ — রোল টাইপ ব্রেকডাউন</CardTitle>
                <CardDescription>BOPP, CPP ও PP রোলের ইনকামিং, আউটগোয়িং ও ব্যালেন্স।</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : rollBreakdown.length === 0 ? (
                  <EmptyState
                    message="এখনো কোনো রোল মুভমেন্ট নেই।"
                    actionLabel="রোল এন্ট্রি করুন"
                    to="/rolls"
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>রোল টাইপ</TableHead>
                        <TableHead className="text-right">ইনকামিং</TableHead>
                        <TableHead className="text-right">আউটগোয়িং</TableHead>
                        <TableHead className="text-right">ব্যালেন্স</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rollBreakdown.map((row) => (
                        <TableRow key={row.roll_type}>
                          <TableCell className="font-medium">
                            <Badge variant="secondary">{row.roll_type}</Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatKg(row.incoming)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatKg(row.outgoing)}
                          </TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">
                            {formatKg(row.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">মডিউল ২ — গ্রেড ব্রেকডাউন</CardTitle>
                <CardDescription>গ্রেড অনুযায়ী গ্রানুল স্টকের ইনকামিং, আউটগোয়িং ও ব্যালেন্স।</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : granuleBreakdown.length === 0 ? (
                  <EmptyState
                    message="এখনো কোনো গ্রানুল মুভমেন্ট নেই।"
                    actionLabel="গ্রানুল এন্ট্রি করুন"
                    to="/granules"
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>গ্রেড</TableHead>
                        <TableHead className="text-right">ইনকামিং</TableHead>
                        <TableHead className="text-right">আউটগোয়িং</TableHead>
                        <TableHead className="text-right">ব্যালেন্স</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {granuleBreakdown.map((row) => (
                        <TableRow key={row.grade}>
                          <TableCell className="font-medium">{row.grade}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatKg(row.incoming)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatKg(row.outgoing)}
                          </TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">
                            {formatKg(row.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </section>

          <section aria-label="সাম্প্রতিক মুভমেন্ট" className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-lg">সাম্প্রতিক রোল মুভমেন্ট</CardTitle>
                  <CardDescription>সর্বশেষ ৫টি এন্ট্রি।</CardDescription>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/rolls">
                    সব দেখুন
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : recentRolls.length === 0 ? (
                  <EmptyState
                    message="কোনো রোল এন্ট্রি পাওয়া যায়নি।"
                    actionLabel="রোল এন্ট্রি করুন"
                    to="/rolls"
                  />
                ) : (
                  <ul className="space-y-3">
                    {recentRolls.map((movement) => (
                      <li
                        key={movement.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {movement.roll_type} · {movement.size} · {movement.micron}μ
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {movement.supplier || "সাপ্লায়ার নেই"} · {movement.created_by_name || "স্টাফ"}
                          </p>
                        </div>
                        <DirectionBadge direction={movement.direction} weight={movement.weight_kg} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-lg">সাম্প্রতিক গ্রানুল মুভমেন্ট</CardTitle>
                  <CardDescription>সর্বশেষ ৫টি এন্ট্রি।</CardDescription>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/granules">
                    সব দেখুন
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : recentGranules.length === 0 ? (
                  <EmptyState
                    message="কোনো গ্রানুল এন্ট্রি পাওয়া যায়নি।"
                    actionLabel="গ্রানুল এন্ট্রি করুন"
                    to="/granules"
                  />
                ) : (
                  <ul className="space-y-3">
                    {recentGranules.map((movement) => (
                      <li
                        key={movement.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {movement.grade} · ব্যাচ {movement.batch_number}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {movement.machine || "মেশিন নেই"} · {movement.created_by_name || "স্টাফ"}
                          </p>
                        </div>
                        <DirectionBadge direction={movement.direction} weight={movement.weight_kg} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  hint: string;
  icon: typeof Layers;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-wide">
            {title}
          </CardDescription>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function DirectionBadge({ direction, weight }: { direction: "in" | "out"; weight: number }) {
  const isIncoming = direction === "in";
  return (
    <Badge variant={isIncoming ? "secondary" : "outline"} className="shrink-0 gap-1">
      {isIncoming ? (
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {isIncoming ? "+" : "−"}
      {formatKg(weight)}
    </Badge>
  );
}

function EmptyState({
  message,
  actionLabel,
  to,
}: {
  message: string;
  actionLabel: string;
  to: "/rolls" | "/granules";
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button asChild size="sm" variant="outline">
        <Link to={to}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
