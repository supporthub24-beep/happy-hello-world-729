import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Boxes,
  Factory,
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
import {
  aggregateGranuleStock,
  createGranuleMovement,
  deleteGranuleMovement,
  fetchGranuleMovements,
  filterGranuleMovements,
  formatDate,
  formatKg,
  granuleBreakdownByGrade,
  granuleTotals,
  todayISO,
  type Direction,
  type GranuleFilters,
  type GranuleMovement,
} from "@/lib/inventory";

export const Route = createFileRoute("/granules")({
  head: () => ({
    meta: [
      { title: "গ্রানুল স্টক — ইনভেন্টরি ম্যানেজার" },
      {
        name: "description",
        content:
          "গ্রেড ও ব্যাচ অনুযায়ী প্লাস্টিক গ্রানুল (ডানা) স্টক — ইনকামিং, মেশিন/লাইনভিত্তিক আউটগোয়িং, স্টক লিস্ট এবং ডাইনামিক রিপোর্ট।",
      },
      { property: "og:title", content: "গ্রানুল স্টক — ইনভেন্টরি ম্যানেজার" },
      {
        property: "og:description",
        content:
          "মডিউল ২: গ্রেড, ব্যাচ ও সাপ্লায়ার অনুযায়ী গ্রানুল স্টক ট্র্যাকিং এবং ডাইনামিক রিপোর্ট।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GranulesPage,
});

type EntryFormState = {
  direction: Direction;
  grade: string;
  batch_number: string;
  supplier: string;
  machine: string;
  weight_kg: string;
  notes: string;
  movement_date: string;
};

const emptyForm: EntryFormState = {
  direction: "in",
  grade: "",
  batch_number: "",
  supplier: "",
  machine: "",
  weight_kg: "",
  notes: "",
  movement_date: todayISO(),
};

function GranulesPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, configured, displayName, signOut } = useAuth();

  const [movements, setMovements] = useState<GranuleMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [form, setForm] = useState<EntryFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<GranuleFilters>({
    grade: "",
    batch: "",
    supplier: "",
    from: "",
    to: "",
  });

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

    fetchGranuleMovements()
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

  const totals = useMemo(() => granuleTotals(movements), [movements]);
  const stockRows = useMemo(() => aggregateGranuleStock(movements), [movements]);
  const gradeBreakdown = useMemo(() => granuleBreakdownByGrade(movements), [movements]);
  const filteredMovements = useMemo(
    () => filterGranuleMovements(movements, filters),
    [movements, filters],
  );
  const filteredTotals = useMemo(() => granuleTotals(filteredMovements), [filteredMovements]);

  const gradeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const movement of movements) {
      if (movement.grade.trim()) set.add(movement.grade);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [movements]);

  const batchOptions = useMemo(() => {
    const set = new Set<string>();
    for (const movement of movements) {
      if (movement.batch_number.trim()) set.add(movement.batch_number);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [movements]);

  const supplierOptions = useMemo(() => {
    const set = new Set<string>();
    for (const movement of movements) {
      if (movement.supplier.trim()) set.add(movement.supplier);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [movements]);

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/login" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormNotice(null);

    const weight = Number(form.weight_kg);

    if (!form.grade.trim()) {
      setFormError("গ্রেড লিখুন (যেমন PP-H110MA)।");
      return;
    }
    if (!form.batch_number.trim()) {
      setFormError("ব্যাচ নম্বর লিখুন।");
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
      await createGranuleMovement(
        {
          direction: form.direction,
          grade: form.grade,
          batch_number: form.batch_number,
          supplier: form.supplier,
          machine: form.direction === "out" ? form.machine : "",
          weight_kg: weight,
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
        grade: prev.grade,
        supplier: prev.supplier,
        machine: prev.machine,
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
      await deleteGranuleMovement(id);
      setReloadKey((key) => key + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "এন্ট্রি মুছে ফেলা যায়নি।");
    } finally {
      setDeletingId(null);
    }
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
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                ড্যাশবোর্ড
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/rolls">
                <Layers className="h-4 w-4" aria-hidden="true" />
                ফিল্ম রোল
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
                <Package className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                মডিউল ২
              </Badge>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                গ্রানুল / ডানা স্টক
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                গ্রেড ও ব্যাচ অনুযায়ী কাঁচামাল ডানার ইনকামিং এবং মেশিন/লাইনভিত্তিক আউটগোয়িং।
                মডিউল ১ থেকে সম্পূর্ণ আলাদা ডেটা ও স্টক টোটাল।
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

          <section aria-label="গ্রানুল স্টক সামারি" className="grid gap-4 sm:grid-cols-3">
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

            <TabsContent value="entry" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">গ্রানুল মুভমেন্ট এন্ট্রি</CardTitle>
                  <CardDescription>
                    ইনকামিং স্টকে যোগ করে, আউটগোয়িং স্টক থেকে বাদ দেয়। এন্ট্রি করা স্টাফের নাম
                    স্বয়ংক্রিয়ভাবে রেকর্ড হয়।
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="granule-direction">মুভমেন্টের ধরন</Label>
                      <Select
                        value={form.direction}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, direction: value as Direction }))
                        }
                      >
                        <SelectTrigger id="granule-direction">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">ইনকামিং (স্টকে যোগ)</SelectItem>
                          <SelectItem value="out">আউটগোয়িং (স্টক থেকে বাদ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="granule-grade">গ্রেড</Label>
                        <Input
                          id="granule-grade"
                          list="granule-grade-options"
                          required
                          value={form.grade}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, grade: event.target.value }))
                          }
                          placeholder="যেমন PP-H110MA"
                        />
                        <datalist id="granule-grade-options">
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="granule-batch">ব্যাচ নম্বর</Label>
                        <Input
                          id="granule-batch"
                          list="granule-batch-options"
                          required
                          value={form.batch_number}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, batch_number: event.target.value }))
                          }
                          placeholder="যেমন B-2026-014"
                        />
                        <datalist id="granule-batch-options">
                          {batchOptions.map((batch) => (
                            <option key={batch} value={batch} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="granule-supplier">সাপ্লায়ার</Label>
                        <Input
                          id="granule-supplier"
                          list="granule-supplier-options"
                          value={form.supplier}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, supplier: event.target.value }))
                          }
                          placeholder="সাপ্লায়ারের নাম"
                        />
                        <datalist id="granule-supplier-options">
                          {supplierOptions.map((supplier) => (
                            <option key={supplier} value={supplier} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="granule-weight">ওজন (কেজি)</Label>
                        <Input
                          id="granule-weight"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.001"
                          required
                          value={form.weight_kg}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, weight_kg: event.target.value }))
                          }
                          placeholder="যেমন 500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="granule-date">তারিখ</Label>
                        <Input
                          id="granule-date"
                          type="date"
                          required
                          value={form.movement_date}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, movement_date: event.target.value }))
                          }
                        />
                      </div>
                      {form.direction === "out" ? (
                        <div className="space-y-2">
                          <Label htmlFor="granule-machine">মেশিন / প্রোডাকশন লাইন</Label>
                          <Input
                            id="granule-machine"
                            list="granule-machine-options"
                            value={form.machine}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, machine: event.target.value }))
                            }
                            placeholder="যেমন এক্সট্রুডার লাইন ২"
                          />
                          <datalist id="granule-machine-options">
                            <option value="এক্সট্রুডার লাইন ১" />
                            <option value="এক্সট্রুডার লাইন ২" />
                            <option value="ইনজেকশন মেশিন" />
                            <option value="ব্লো ফিল্ম লাইন" />
                          </datalist>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="granule-notes">নোট (ঐচ্ছিক)</Label>
                      <Textarea
                        id="granule-notes"
                        rows={3}
                        value={form.notes}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, notes: event.target.value }))
                        }
                        placeholder="অতিরিক্ত তথ্য, যেমন চালান নম্বর বা মানের মন্তব্য"
                      />
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

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">সর্বশেষ এন্ট্রি</CardTitle>
                  <CardDescription>
                    সর্বশেষ ৫টি মুভমেন্ট — কে এন্ট্রি করেছে সহ।
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : movements.length === 0 ? (
                    <EmptyState message="এখনো কোনো গ্রানুল মুভমেন্ট নেই।" />
                  ) : (
                    <MovementTable
                      movements={movements.slice(0, 5)}
                      deletingId={deletingId}
                      onDelete={handleDelete}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stock" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">গ্রেড + ব্যাচ অনুযায়ী স্টক</CardTitle>
                  <CardDescription>
                    প্রতিটি গ্রেড ও ব্যাচ কম্বিনেশনের বর্তমান ব্যালেন্স।
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
                    <EmptyState message="স্টক লিস্ট খালি — প্রথমে একটি ইনকামিং এন্ট্রি করুন।" />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>গ্রেড</TableHead>
                          <TableHead>ব্যাচ</TableHead>
                          <TableHead className="text-right">ইনকামিং</TableHead>
                          <TableHead className="text-right">আউটগোয়িং</TableHead>
                          <TableHead className="text-right">ব্যালেন্স</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockRows.map((row) => (
                          <TableRow key={`${row.grade}__${row.batch_number}`}>
                            <TableCell className="font-medium">{row.grade}</TableCell>
                            <TableCell>{row.batch_number}</TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatKg(row.incoming_kg)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatKg(row.outgoing_kg)}
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums">
                              {formatKg(row.balance_kg)}
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
                  <CardTitle className="font-display text-lg">গ্রেড অনুযায়ী ব্রেকডাউন</CardTitle>
                  <CardDescription>গ্রেডভিত্তিক মোট ইনকামিং, আউটগোয়িং ও ব্যালেন্স।</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : gradeBreakdown.length === 0 ? (
                    <EmptyState message="ব্রেকডাউন দেখানোর মতো ডেটা নেই।" />
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
                        {gradeBreakdown.map((row) => (
                          <TableRow key={row.grade}>
                            <TableCell className="font-medium">
                              <Badge variant="secondary">{row.grade}</Badge>
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
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">ডাইনামিক রিপোর্ট</CardTitle>
                  <CardDescription>
                    গ্রেড, ব্যাচ, সাপ্লায়ার ও তারিখ রেঞ্জ দিয়ে ফিল্টার করে ইনকামিং বনাম আউটগোয়িং
                    দেখুন।
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="filter-grade">গ্রেড</Label>
                      <Input
                        id="filter-grade"
                        value={filters.grade ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, grade: event.target.value }))
                        }
                        placeholder="সব গ্রেড"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-batch">ব্যাচ নম্বর</Label>
                      <Input
                        id="filter-batch"
                        value={filters.batch ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, batch: event.target.value }))
                        }
                        placeholder="সব ব্যাচ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-supplier">সাপ্লায়ার</Label>
                      <Input
                        id="filter-supplier"
                        value={filters.supplier ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, supplier: event.target.value }))
                        }
                        placeholder="সব সাপ্লায়ার"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-from">শুরুর তারিখ</Label>
                      <Input
                        id="filter-from"
                        type="date"
                        value={filters.from ?? ""}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, from: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter-to">শেষ তারিখ</Label>
                      <Input
                        id="filter-to"
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
                          setFilters({ grade: "", batch: "", supplier: "", from: "", to: "" })
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
                      title="ফিল্টারড ব্যালেন্স"
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
                    <EmptyState message="এই ফিল্টারে কোনো মুভমেন্ট পাওয়া যায়নি।" />
                  ) : (
                    <MovementTable
                      movements={filteredMovements}
                      deletingId={deletingId}
                      onDelete={handleDelete}
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
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <Factory className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function MovementTable({
  movements,
  deletingId,
  onDelete,
}: {
  movements: GranuleMovement[];
  deletingId: string | null;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>তারিখ</TableHead>
            <TableHead>ধরন</TableHead>
            <TableHead>গ্রেড</TableHead>
            <TableHead>ব্যাচ</TableHead>
            <TableHead>সাপ্লায়ার</TableHead>
            <TableHead>মেশিন / লাইন</TableHead>
            <TableHead className="text-right">ওজন</TableHead>
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
                {movement.direction === "in" ? (
                  <Badge variant="secondary">
                    <ArrowDownToLine className="mr-1 h-3 w-3" aria-hidden="true" />
                    ইন
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <ArrowUpFromLine className="mr-1 h-3 w-3" aria-hidden="true" />
                    আউট
                  </Badge>
                )}
              </TableCell>
              <TableCell className="font-medium">{movement.grade}</TableCell>
              <TableCell>{movement.batch_number}</TableCell>
              <TableCell>{movement.supplier || "—"}</TableCell>
              <TableCell>{movement.machine || "—"}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatKg(movement.weight_kg)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {movement.created_by_name || "—"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(movement.id)}
                  disabled={deletingId === movement.id}
                  aria-label={`${movement.grade} ব্যাচ ${movement.batch_number} এন্ট্রি মুছুন`}
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
