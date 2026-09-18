import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Boxes,
  Layers,
  Loader2,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import {
  ROLL_TYPES,
  aggregateFilmRollStock,
  createFilmRollMovement,
  deleteFilmRollMovement,
  fetchFilmRollMovements,
  filmRollTotals,
  filterFilmRollMovements,
  formatDate,
  formatKg,
  todayISO,
  type Direction,
  type FilmRollFilters,
  type FilmRollMovement,
  type RollType,
} from "@/lib/inventory";

export const Route = createFileRoute("/rolls")({
  head: () => ({
    meta: [
      { title: "ফিল্ম রোল স্টক — ইনভেন্টরি ম্যানেজার" },
      {
        name: "description",
        content:
          "BOPP, CPP ও PP ফিল্ম রোলের ইনকামিং ও আউটগোয়িং এন্ট্রি, সাইজ ও মাইক্রন অনুযায়ী অ্যাগ্রিগেটেড স্টক এবং ফিল্টারসহ ইনভেন্টরি ও রিপোর্ট।",
      },
      { property: "og:title", content: "ফিল্ম রোল স্টক — ইনভেন্টরি ম্যানেজার" },
      {
        property: "og:description",
        content:
          "মডিউল ১: রোল টাইপ, সাইজ ও মাইক্রন অনুযায়ী স্টক ট্র্যাকিং এবং ডাইনামিক রিপোর্ট।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RollsPage,
});

type EntryFormState = {
  direction: Direction;
  roll_type: RollType;
  size: string;
  micron: string;
  weight_kg: string;
  supplier: string;
  notes: string;
  movement_date: string;
};

const emptyForm: EntryFormState = {
  direction: "in",
  roll_type: "BOPP",
  size: "",
  micron: "",
  weight_kg: "",
  supplier: "",
  notes: "",
  movement_date: todayISO(),
};

function RollsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, configured, displayName, signOut } = useAuth();
  const { addItem } = useCart();

  const [movements, setMovements] = useState<FilmRollMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [form, setForm] = useState<EntryFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilmRollFilters>({
    rollType: "all",
    size: "",
    micron: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    if (!authLoading && !user && configured) {
      void navigate({ to: "/login" });
    }
  }, [authLoading, user, configured, navigate]);

  useEffect(() => {
    if (!user || !configured) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchFilmRollMovements()
      .then((data) => {
        if (!active) return;
        setMovements(data);
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

  const totals = useMemo(() => filmRollTotals(movements), [movements]);
  const stockRows = useMemo(() => aggregateFilmRollStock(movements), [movements]);
  const filteredMovements = useMemo(
    () => filterFilmRollMovements(movements, filters),
    [movements, filters],
  );
  const filteredTotals = useMemo(() => filmRollTotals(filteredMovements), [filteredMovements]);

  const micronOptions = useMemo(() => {
    const set = new Set<string>();
    for (const movement of movements) set.add(String(movement.micron));
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [movements]);

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/login" });
  }

  function handleAddToCart(row: ReturnType<typeof aggregateFilmRollStock>[number]) {
    addItem({
      id: `roll-${row.roll_type}-${row.size}-${row.micron}`,
      name: `${row.roll_type} ফিল্ম রোল`,
      bangla: `${row.size} · ${row.micron} মাইক্রন`,
      price: 0,
      image: "",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormNotice(null);

    const micron = Number(form.micron);
    const weight = Number(form.weight_kg);

    if (!form.size.trim()) {
      setFormError("সাইজ লিখুন (যেমন ৩০০ মিমি বা 12 inch)।");
      return;
    }
    if (!Number.isFinite(micron) || micron <= 0) {
      setFormError("মাইক্রন একটি ধনাত্মক সংখ্যা হতে হবে।");
      return;
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      setFormError("ওজন (কেজি) একটি ধনাত্মক সংখ্যা হতে হবে।");
      return;
    }
    if (!form.movement_date) {
      setFormError("তারিখ নির্বাচন করুন।");
      return;
    }

    setSaving(true);
    try {
      await createFilmRollMovement(
        {
          direction: form.direction,
          roll_type: form.roll_type,
          size: form.size,
          micron,
          weight_kg: weight,
          supplier: form.supplier,
          notes: form.notes,
          movement_date: form.movement_date,
        },
        { id: user?.id ?? null, name: displayName || "স্টাফ" },
      );
      setFormNotice(
        form.direction === "in"
          ? "ইনকামিং এন্ট্রি সংরক্ষিত হয়েছে এবং স্টকে যোগ হয়েছে।"
          : "আউটগোয়িং এন্ট্রি সংরক্ষিত হয়েছে এবং স্টক থেকে বাদ হয়েছে।",
      );
      setForm((prev) => ({
        ...emptyForm,
        direction: prev.direction,
        roll_type: prev.roll_type,
        movement_date: prev.movement_date,
      }));
      setReloadKey((key) => key + 1);
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "এন্ট্রি সংরক্ষণ করা যায়নি।");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      await deleteFilmRollMovement(id);
      setReloadKey((key) => key + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "এন্ট্রি মুছে ফেলা যায়নি।");
    } finally {
      setDeletingId(null);
    }
  }

  if (authLoading || (configured && !user && !error)) {
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
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                ড্যাশবোর্ড
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
              <Badge variant="secondary" className="mb-2">
                <Layers className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                মডিউল ১
              </Badge>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                ফিল্ম রোল স্টক
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                BOPP, CPP ও PP রোলের ইনকামিং ও আউটগোয়িং এন্ট্রি। সাইজ ও মাইক্রন অনুযায়ী স্টক
                স্বয়ংক্রিয়ভাবে অ্যাগ্রিগেট হয়।
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
                মডিউলের ডেটা লোড হবে।
              </AlertDescription>
            </Alert>
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>সমস্যা হয়েছে</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{error}</p>
                <Button size="sm" variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
                  আবার চেষ্টা করুন
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          <section aria-label="রোল স্টক সামারি" className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="মোট ইনকামিং"
              value={formatKg(totals.incoming)}
              icon={ArrowDownToLine}
              loading={loading}
            />
            <SummaryCard
              title="মোট আউটগোয়িং"
              value={formatKg(totals.outgoing)}
              icon={ArrowUpFromLine}
              loading={loading}
            />
            <SummaryCard
              title="বর্তমান স্টক"
              value={formatKg(totals.balance)}
              icon={Boxes}
              loading={loading}
            />
          </section>

          <Tabs defaultValue="entry" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-3">
              <TabsTrigger value="entry">নতুন এন্ট্রি</TabsTrigger>
              <TabsTrigger value="stock">স্টক লিস্ট</TabsTrigger>
              <TabsTrigger value="report">রিপোর্ট</TabsTrigger>
            </TabsList>

            <TabsContent value="entry">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">ইনকামিং / আউটগোয়িং এন্ট্রি</CardTitle>
                  <CardDescription>
                    একই সাইজ ও মাইক্রনের জন্য এন্ট্রি করলে স্টক টোটালে যোগ বা বিয়োগ হবে।
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="roll-direction">এন্ট্রির ধরন</Label>
                        <Select
                          value={form.direction}
                          onValueChange={(value) =>
                            setForm((prev) => ({ ...prev, direction: value as Direction }))
                          }
                        >
                          <SelectTrigger id="roll-direction">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">ইনকামিং (স্টকে যোগ)</SelectItem>
                            <SelectItem value="out">আউটগোয়িং (স্টক থেকে বাদ)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll-type">রোল টাইপ</Label>
                        <Select
                          value={form.roll_type}
                          onValueChange={(value) =>
                            setForm((prev) => ({ ...prev, roll_type: value as RollType }))
                          }
                        >
                          <SelectTrigger id="roll-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLL_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll-size">সাইজ</Label>
                        <Input
                          id="roll-size"
                          required
                          value={form.size}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, size: event.target.value }))
                          }
                          placeholder="যেমন ৩০০ মিমি / 12 inch"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll-micron">মাইক্রন</Label>
                        <Input
                          id="roll-micron"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          required
                          value={form.micron}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, micron: event.target.value }))
                          }
                          placeholder="যেমন 40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll-weight">ওজন (কেজি)</Label>
                        <Input
                          id="roll-weight"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.001"
                          required
                          value={form.weight_kg}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, weight_kg: event.target.value }))
                          }
                          placeholder="যেমন 250.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll-supplier">সাপ্লায়ার</Label>
                        <Input
                          id="roll-supplier"
                          value={form.supplier}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, supplier: event.target.value }))
                          }
                          placeholder="সাপ্লায়ারের নাম"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll-date">তারিখ</Label>
                        <Input
                          id="roll-date"
                          type="date"
                          required
                          value={form.movement_date}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, movement_date: event.target.value }))
                          }
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="roll-notes">নোট (ঐচ্ছিক)</Label>
                        <Textarea
                          id="roll-notes"
                          rows={2}
                          value={form.notes}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, notes: event.target.value }))
                          }
                          placeholder="অতিরিক্ত তথ্য, যেমন চালান নম্বর বা গাড়ির নম্বর"
                        />
                      </div>
                    </div>

                    {formError ? (
                      <Alert variant="destructive">
                        <AlertTitle>এন্ট্রি সংরক্ষণ করা যায়নি</AlertTitle>
                        <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                    ) : null}

                    {formNotice ? (
                      <Alert>
                        <AlertTitle>সফল</AlertTitle>
                        <AlertDescription>{formNotice}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Button type="submit" disabled={saving || !configured}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      )}
                      এন্ট্রি সংরক্ষণ করুন
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stock" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">স্টক ফিল্টার</CardTitle>
                  <CardDescription>
                    রোল টাইপ, সাইজ ও মাইক্রন দিয়ে বর্তমান স্টক দেখুন।
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="filter-roll-type">রোল টাইপ</Label>
                      <Select
                        value={filters.rollType ?? "all"}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            rollType: value as RollType | "all",
                          }))
                        }
                      >
                        <SelectTrigger id="filter-roll-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">সব টাইপ</SelectItem>
                          {ROLL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filter-size">সাইজ</Label>
                      <Input
                        id="filter-size"
                        value={filters.size ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, size: event.target.value }))
                        }
                        placeholder="সাইজ লিখে খুঁজুন"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filter-micron">মাইক্রন</Label>
                      <Select
                        value={filters.micron && filters.micron !== "" ? filters.micron : "all"}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            micron: value === "all" ? "" : value,
                          }))
                        }
                      >
                        <SelectTrigger id="filter-micron">
                          <SelectValue placeholder="সব মাইক্রন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">সব মাইক্রন</SelectItem>
                          {micronOptions.map((micron) => (
                            <SelectItem key={micron} value={micron}>
                              {micron}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">বর্তমান স্টক</CardTitle>
                  <CardDescription>
                    সাইজ + মাইক্রন কম্বিনেশন অনুযায়ী অ্যাগ্রিগেটেড স্টক।
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : stockRows.length === 0 ? (
                    <EmptyState
                      message="এখনো কোনো রোল স্টক নেই। প্রথমে ইনকামিং এন্ট্রি করুন।"
                      actionLabel="নতুন এন্ট্রি করুন"
                      onAction={() => setReloadKey((key) => key + 1)}
                    />
                  ) : (
                    <StockTable
                      rows={stockRows}
                      filters={filters}
                      onAddToCart={handleAddToCart}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">ডাইনামিক রিপোর্ট</CardTitle>
                  <CardDescription>
                    রোল টাইপ, সাইজ, মাইক্রন ও তারিখ রেঞ্জ দিয়ে ইনকামিং বনাম আউটগোয়িং দেখুন।
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="report-roll-type">রোল টাইপ</Label>
                      <Select
                        value={filters.rollType ?? "all"}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            rollType: value as RollType | "all",
                          }))
                        }
                      >
                        <SelectTrigger id="report-roll-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">সব টাইপ</SelectItem>
                          {ROLL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-size">সাইজ</Label>
                      <Input
                        id="report-size"
                        value={filters.size ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, size: event.target.value }))
                        }
                        placeholder="সাইজ লিখে খুঁজুন"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-micron">মাইক্রন</Label>
                      <Select
                        value={filters.micron && filters.micron !== "" ? filters.micron : "all"}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            micron: value === "all" ? "" : value,
                          }))
                        }
                      >
                        <SelectTrigger id="report-micron">
                          <SelectValue placeholder="সব মাইক্রন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">সব মাইক্রন</SelectItem>
                          {micronOptions.map((micron) => (
                            <SelectItem key={micron} value={micron}>
                              {micron}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-from">শুরুর তারিখ</Label>
                      <Input
                        id="report-from"
                        type="date"
                        value={filters.from ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, from: event.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-to">শেষ তারিখ</Label>
                      <Input
                        id="report-to"
                        type="date"
                        value={filters.to ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, to: event.target.value }))
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          setFilters({
                            rollType: "all",
                            size: "",
                            micron: "",
                            from: "",
                            to: "",
                          })
                        }
                      >
                        ফিল্টার রিসেট
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <SummaryCard
                      title="ফিল্টারড ইনকামিং"
                      value={formatKg(filteredTotals.incoming)}
                      icon={ArrowDownToLine}
                      loading={loading}
                    />
                    <SummaryCard
                      title="ফিল্টারড আউটগোয়িং"
                      value={formatKg(filteredTotals.outgoing)}
                      icon={ArrowUpFromLine}
                      loading={loading}
                    />
                    <SummaryCard
                      title="নেট পরিবর্তন"
                      value={formatKg(filteredTotals.balance)}
                      icon={Boxes}
                      loading={loading}
                    />
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : filteredMovements.length === 0 ? (
                    <EmptyState
                      message="এই ফিল্টারে কোনো মুভমেন্ট পাওয়া যায়নি।"
                      actionLabel="ফিল্টার রিসেট করুন"
                      onAction={() =>
                        setFilters({
                          rollType: "all",
                          size: "",
                          micron: "",
                          from: "",
                          to: "",
                        })
                      }
                    />
                  ) : (
                    <MovementTable
                      movements={filteredMovements}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  icon: typeof Boxes;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{title}</CardDescription>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="font-display text-2xl font-bold tabular-nums text-foreground">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StockTable({
  rows,
  filters,
  onAddToCart,
}: {
  rows: ReturnType<typeof aggregateFilmRollStock>;
  filters: FilmRollFilters;
  onAddToCart: (row: ReturnType<typeof aggregateFilmRollStock>[number]) => void;
}) {
  const size = filters.size?.trim().toLowerCase() ?? "";
  const micron = filters.micron?.trim() ?? "";
  const visible = rows.filter((row) => {
    if (filters.rollType && filters.rollType !== "all" && row.roll_type !== filters.rollType) {
      return false;
    }
    if (size && !row.size.toLowerCase().includes(size)) return false;
    if (micron && String(row.micron) !== micron) return false;
    return true;
  });

  if (visible.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        এই ফিল্টারে কোনো স্টক লাইন পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>রোল টাইপ</TableHead>
            <TableHead>সাইজ</TableHead>
            <TableHead className="text-right">মাইক্রন</TableHead>
            <TableHead className="text-right">ইনকামিং</TableHead>
            <TableHead className="text-right">আউটগোয়িং</TableHead>
            <TableHead className="text-right">ব্যালেন্স</TableHead>
            <TableHead className="text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((row) => (
            <TableRow key={`${row.roll_type}-${row.size}-${row.micron}`}>
              <TableCell>
                <Badge variant="secondary">{row.roll_type}</Badge>
              </TableCell>
              <TableCell className="font-medium">{row.size}</TableCell>
              <TableCell className="text-right tabular-nums">{row.micron}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatKg(row.incoming_kg)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatKg(row.outgoing_kg)}
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatKg(row.balance_kg)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddToCart(row)}
                  aria-label={`${row.roll_type} ${row.size} ${row.micron} মাইক্রন কার্টে যোগ করুন`}
                >
                  কার্টে যোগ করুন
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MovementTable({
  movements,
  onDelete,
  deletingId,
}: {
  movements: FilmRollMovement[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>তারিখ</TableHead>
            <TableHead>ধরন</TableHead>
            <TableHead>টাইপ</TableHead>
            <TableHead>সাইজ</TableHead>
            <TableHead className="text-right">মাইক্রন</TableHead>
            <TableHead className="text-right">ওজন</TableHead>
            <TableHead>সাপ্লায়ার</TableHead>
            <TableHead>এন্ট্রি করেছেন</TableHead>
            <TableHead className="text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="whitespace-nowrap">
                {formatDate(movement.movement_date)}
              </TableCell>
              <TableCell>
                <Badge variant={movement.direction === "in" ? "secondary" : "outline"}>
                  {movement.direction === "in" ? "ইনকামিং" : "আউটগোয়িং"}
                </Badge>
              </TableCell>
              <TableCell>{movement.roll_type}</TableCell>
              <TableCell>{movement.size}</TableCell>
              <TableCell className="text-right tabular-nums">{movement.micron}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatKg(movement.weight_kg)}
              </TableCell>
              <TableCell>{movement.supplier || "—"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {movement.created_by_name || "—"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(movement.id)}
                  disabled={deletingId === movement.id}
                  aria-label={`${movement.roll_type} ${movement.size} এন্ট্রি মুছুন`}
                >
                  {deletingId === movement.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Boxes className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button size="sm" variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
