import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Factory,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  aggregateGranuleStock,
  createGranuleMovement,
  deleteGranuleMovement,
  fetchGranuleMovements,
  formatDate,
  formatKg,
  granuleTotals,
  todayISO,
  uniqueValues,
  type Direction,
  type GranuleFilters,
} from "@/lib/inventory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/granules")({
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

const EMPTY_FORM: EntryFormState = {
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
  const { user, displayName } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<EntryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const [filters, setFilters] = useState<GranuleFilters>({
    grade: "",
    batchNumber: "",
    supplier: "",
    from: "",
    to: "",
  });

  const movementsQuery = useQuery({
    queryKey: ["granule-movements"],
    queryFn: () => fetchGranuleMovements(),
  });

  const movements = movementsQuery.data ?? [];

  const createMutation = useMutation({
    mutationFn: async (state: EntryFormState) => {
      if (!user) throw new Error("You must be signed in to record an entry.");
      return createGranuleMovement(
        {
          direction: state.direction,
          grade: state.grade,
          batch_number: state.batch_number,
          supplier: state.supplier,
          machine: state.machine,
          weight_kg: Number(state.weight_kg),
          notes: state.notes,
          movement_date: state.movement_date,
        },
        { id: user.id, name: displayName },
      );
    },
    onSuccess: async () => {
      setForm((prev) => ({
        ...EMPTY_FORM,
        direction: prev.direction,
        grade: prev.grade,
        batch_number: prev.batch_number,
        supplier: prev.supplier,
        machine: prev.machine,
        movement_date: prev.movement_date,
      }));
      setFormError(null);
      setFormNotice("Entry recorded and granule stock totals updated.");
      await queryClient.invalidateQueries({ queryKey: ["granule-movements"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: unknown) => {
      setFormNotice(null);
      setFormError(
        error instanceof Error ? error.message : "Could not save the entry.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGranuleMovement(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["granule-movements"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const stockRows = useMemo(() => aggregateGranuleStock(movements), [movements]);
  const totals = useMemo(() => granuleTotals(stockRows), [stockRows]);

  const gradeOptions = useMemo(
    () => uniqueValues(movements.map((movement) => movement.grade)),
    [movements],
  );
  const batchOptions = useMemo(
    () => uniqueValues(movements.map((movement) => movement.batch_number)),
    [movements],
  );
  const supplierOptions = useMemo(
    () => uniqueValues(movements.map((movement) => movement.supplier)),
    [movements],
  );

  const filteredStock = useMemo(() => {
    return stockRows.filter((row) => {
      if (filters.grade && filters.grade.trim()) {
        if (row.grade !== filters.grade.trim()) return false;
      }
      if (filters.batchNumber && filters.batchNumber.trim()) {
        if (row.batch_number !== filters.batchNumber.trim()) return false;
      }
      return true;
    });
  }, [stockRows, filters.grade, filters.batchNumber]);

  const reportRows = useMemo(() => {
    return movements.filter((movement) => {
      if (filters.grade && filters.grade.trim()) {
        if (movement.grade !== filters.grade.trim()) return false;
      }
      if (filters.batchNumber && filters.batchNumber.trim()) {
        if (movement.batch_number !== filters.batchNumber.trim()) return false;
      }
      if (filters.supplier && filters.supplier.trim()) {
        if (movement.supplier !== filters.supplier.trim()) return false;
      }
      if (filters.from && movement.movement_date < filters.from) return false;
      if (filters.to && movement.movement_date > filters.to) return false;
      return true;
    });
  }, [movements, filters]);

  const reportTotals = useMemo(() => {
    return reportRows.reduce(
      (acc, movement) => {
        if (movement.direction === "in") acc.incoming += movement.weight_kg;
        else acc.outgoing += movement.weight_kg;
        return acc;
      },
      { incoming: 0, outgoing: 0 },
    );
  }, [reportRows]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormNotice(null);

    if (!form.grade.trim()) {
      setFormError("Enter the granule grade (for example PP-H110MA).");
      return;
    }
    if (!form.batch_number.trim()) {
      setFormError("Enter the batch number for this granule entry.");
      return;
    }
    const weight = Number(form.weight_kg);
    if (!Number.isFinite(weight) || weight <= 0) {
      setFormError("Enter a valid weight in kilograms greater than zero.");
      return;
    }
    if (!form.movement_date) {
      setFormError("Choose the movement date.");
      return;
    }

    createMutation.mutate(form);
  };

  const loading = movementsQuery.isLoading;
  const errorMessage =
    movementsQuery.error instanceof Error ? movementsQuery.error.message : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Granule inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Raw material (dana) stock tracked by grade and batch. This module is
            fully independent from film roll inventory.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <Boxes className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Module 2
        </Badge>
      </div>

      {errorMessage ? (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Could not load granule data</AlertTitle>
          <AlertDescription>
            {errorMessage} Check your connection and try again.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current stock
                </CardTitle>
                <Boxes className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(totals.balance)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stockRows.length} grade/batch combination
                  {stockRows.length === 1 ? "" : "s"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total received
                </CardTitle>
                <ArrowDownToLine
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(totals.incoming)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  All incoming entries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total consumed
                </CardTitle>
                <ArrowUpFromLine
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(totals.outgoing)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  All outgoing entries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Grades tracked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {gradeOptions.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {batchOptions.length} batch
                  {batchOptions.length === 1 ? "" : "es"} recorded
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="stock" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stock">Inventory list</TabsTrigger>
          <TabsTrigger value="entry">New entry</TabsTrigger>
          <TabsTrigger value="report">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current granule stock</CardTitle>
              <CardDescription>
                Live balance by grade and batch, filtered by grade or batch number.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock-grade">Grade</Label>
                  <Select
                    value={filters.grade || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        grade: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="stock-grade">
                      <SelectValue placeholder="All grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All grades</SelectItem>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-batch">Batch number</Label>
                  <Select
                    value={filters.batchNumber || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        batchNumber: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="stock-batch">
                      <SelectValue placeholder="All batches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All batches</SelectItem>
                      {batchOptions.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                          {batch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : filteredStock.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {stockRows.length === 0
                    ? "No granule stock recorded yet. Add an incoming entry to get started."
                    : "No stock matches the selected filters."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead className="text-right">Incoming</TableHead>
                        <TableHead className="text-right">Outgoing</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStock.map((row) => (
                        <TableRow key={`${row.grade}|${row.batch_number}`}>
                          <TableCell className="font-medium">{row.grade}</TableCell>
                          <TableCell className="text-sm">{row.batch_number}</TableCell>
                          <TableCell className="text-right text-sm">
                            {formatKg(row.incoming_kg)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatKg(row.outgoing_kg)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatKg(row.balance_kg)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record granule movement</CardTitle>
              <CardDescription>
                Incoming stock adds to the grade/batch total. Outgoing consumption
                deducts from it and can be linked to a machine or production line.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="direction">Entry type</Label>
                  <Select
                    value={form.direction}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        direction: value as Direction,
                      }))
                    }
                  >
                    <SelectTrigger id="direction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Incoming stock</SelectItem>
                      <SelectItem value="out">Outgoing consumption</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      name="grade"
                      value={form.grade}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, grade: event.target.value }))
                      }
                      placeholder="e.g. PP-H110MA"
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch_number">Batch number</Label>
                    <Input
                      id="batch_number"
                      name="batch_number"
                      value={form.batch_number}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          batch_number: event.target.value,
                        }))
                      }
                      placeholder="e.g. B-2026-014"
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      name="supplier"
                      value={form.supplier}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          supplier: event.target.value,
                        }))
                      }
                      placeholder="e.g. Bengal Polymer"
                      disabled={createMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machine">
                      Machine / production line{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="machine"
                      name="machine"
                      value={form.machine}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, machine: event.target.value }))
                      }
                      placeholder="e.g. Line 2 — Blown film"
                      disabled={createMutation.isPending}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      name="weight_kg"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.001"
                      value={form.weight_kg}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          weight_kg: event.target.value,
                        }))
                      }
                      placeholder="e.g. 500"
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="movement_date">Date</Label>
                    <Input
                      id="movement_date"
                      name="movement_date"
                      type="date"
                      value={form.movement_date}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          movement_date: event.target.value,
                        }))
                      }
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, notes: event.target.value }))
                    }
                    placeholder="Optional remarks about this movement"
                    rows={3}
                    disabled={createMutation.isPending}
                  />
                </div>

                {formError ? (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                {formNotice ? (
                  <Alert role="status">
                    <AlertDescription>{formNotice}</AlertDescription>
                  </Alert>
                ) : null}

                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Save entry
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic granule report</CardTitle>
              <CardDescription>
                Filter by grade, batch number, supplier and date range to review
                incoming versus outgoing activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="report-grade">Grade</Label>
                  <Select
                    value={filters.grade || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        grade: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="report-grade">
                      <SelectValue placeholder="All grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All grades</SelectItem>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-batch">Batch number</Label>
                  <Select
                    value={filters.batchNumber || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        batchNumber: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="report-batch">
                      <SelectValue placeholder="All batches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All batches</SelectItem>
                      {batchOptions.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                          {batch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-supplier">Supplier</Label>
                  <Select
                    value={filters.supplier || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        supplier: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="report-supplier">
                      <SelectValue placeholder="All suppliers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All suppliers</SelectItem>
                      {supplierOptions.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="report-from">From</Label>
                    <Input
                      id="report-from"
                      type="date"
                      value={filters.from ?? ""}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          from: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-to">To</Label>
                    <Input
                      id="report-to"
                      type="date"
                      value={filters.to ?? ""}
                      onChange={(event) =>
                        setFilters((prev) => ({ ...prev, to: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      grade: "",
                      batchNumber: "",
                      supplier: "",
                      from: "",
                      to: "",
                    })
                  }
                >
                  Reset filters
                </Button>
                <p className="text-sm text-muted-foreground">
                  {reportRows.length} movement{reportRows.length === 1 ? "" : "s"} ·{" "}
                  <span className="font-medium text-foreground">
                    In {formatKg(reportTotals.incoming)}
                  </span>{" "}
                  ·{" "}
                  <span className="font-medium text-foreground">
                    Out {formatKg(reportTotals.outgoing)}
                  </span>
                </p>
              </div>

              <Separator />

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : reportRows.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No movements match the selected filters.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Machine</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead>Recorded by</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportRows.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="whitespace-nowrap text-sm">
                            {formatDate(movement.movement_date)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                movement.direction === "in" ? "secondary" : "outline"
                              }
                            >
                              {movement.direction === "in" ? "In" : "Out"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {movement.grade}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.batch_number}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.supplier || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.machine ? (
                              <span className="inline-flex items-center gap-1">
                                <Factory
                                  className="h-3.5 w-3.5 text-muted-foreground"
                                  aria-hidden="true"
                                />
                                {movement.machine}
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">
                            {formatKg(movement.weight_kg)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {movement.created_by_name || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete entry from ${formatDate(
                                movement.movement_date,
                              )}`}
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(movement.id)}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GranulesPage;
