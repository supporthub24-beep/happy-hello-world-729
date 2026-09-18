import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  aggregateFilmRollStock,
  createFilmRollMovement,
  deleteFilmRollMovement,
  fetchFilmRollMovements,
  filmRollByType,
  filmRollTotals,
  formatDate,
  formatKg,
  ROLL_TYPES,
  todayISO,
  uniqueMicrons,
  uniqueValues,
  type Direction,
  type FilmRollFilters,
  type RollType,
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

export const Route = createFileRoute("/_app/film")({
  component: FilmRollsPage,
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

const EMPTY_FORM: EntryFormState = {
  direction: "in",
  roll_type: "BOPP",
  size: "",
  micron: "",
  weight_kg: "",
  supplier: "",
  notes: "",
  movement_date: todayISO(),
};

function FilmRollsPage() {
  const { user, displayName } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<EntryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilmRollFilters>({
    rollType: "all",
    size: "",
    micron: "",
    from: "",
    to: "",
  });

  const movementsQuery = useQuery({
    queryKey: ["film-roll-movements"],
    queryFn: () => fetchFilmRollMovements(),
  });

  const movements = movementsQuery.data ?? [];

  const createMutation = useMutation({
    mutationFn: async (state: EntryFormState) => {
      if (!user) throw new Error("You must be signed in to record an entry.");
      return createFilmRollMovement(
        {
          direction: state.direction,
          roll_type: state.roll_type,
          size: state.size,
          micron: Number(state.micron),
          weight_kg: Number(state.weight_kg),
          supplier: state.supplier,
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
        roll_type: prev.roll_type,
        size: prev.size,
        micron: prev.micron,
        supplier: prev.supplier,
        movement_date: prev.movement_date,
      }));
      setFormError(null);
      setFormNotice("Entry recorded and stock totals updated.");
      await queryClient.invalidateQueries({ queryKey: ["film-roll-movements"] });
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
    mutationFn: (id: string) => deleteFilmRollMovement(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["film-roll-movements"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const stockRows = useMemo(() => aggregateFilmRollStock(movements), [movements]);
  const totals = useMemo(() => filmRollTotals(stockRows), [stockRows]);
  const byType = useMemo(() => filmRollByType(stockRows), [stockRows]);

  const sizeOptions = useMemo(
    () => uniqueValues(movements.map((movement) => movement.size)),
    [movements],
  );
  const micronOptions = useMemo(() => uniqueMicrons(movements), [movements]);

  const filteredStock = useMemo(() => {
    return stockRows.filter((row) => {
      if (filters.rollType && filters.rollType !== "all") {
        if (row.roll_type !== filters.rollType) return false;
      }
      if (filters.size && filters.size.trim()) {
        if (row.size !== filters.size.trim()) return false;
      }
      if (filters.micron && filters.micron.trim()) {
        if (row.micron !== Number(filters.micron)) return false;
      }
      return true;
    });
  }, [stockRows, filters.rollType, filters.size, filters.micron]);

  const reportRows = useMemo(() => {
    return movements.filter((movement) => {
      if (filters.rollType && filters.rollType !== "all") {
        if (movement.roll_type !== filters.rollType) return false;
      }
      if (filters.size && filters.size.trim()) {
        if (movement.size !== filters.size.trim()) return false;
      }
      if (filters.micron && filters.micron.trim()) {
        if (movement.micron !== Number(filters.micron)) return false;
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

    if (!form.size.trim()) {
      setFormError("Enter the roll size (for example 500 mm).");
      return;
    }
    const micron = Number(form.micron);
    if (!Number.isFinite(micron) || micron <= 0) {
      setFormError("Enter a valid micron value greater than zero.");
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
            Film roll inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            BOPP, CPP and PP rolls aggregated by size and micron. Entries are
            recorded against your staff account.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <Package className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Module 1
        </Badge>
      </div>

      {errorMessage ? (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Could not load film roll data</AlertTitle>
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
                <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(totals.balance)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stockRows.length} size/micron combination
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
                  Total issued
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
                  Stock by roll type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {byType.map((row) => (
                    <li
                      key={row.roll_type}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-muted-foreground">{row.roll_type}</span>
                      <span className="font-semibold">{formatKg(row.balance_kg)}</span>
                    </li>
                  ))}
                </ul>
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

        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter stock</CardTitle>
              <CardDescription>
                Narrow the current stock by roll type, size and micron.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="stock-roll-type">Roll type</Label>
                  <Select
                    value={filters.rollType ?? "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        rollType: value as RollType | "all",
                      }))
                    }
                  >
                    <SelectTrigger id="stock-roll-type">
                      <SelectValue placeholder="All roll types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roll types</SelectItem>
                      {ROLL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-size">Size</Label>
                  <Select
                    value={filters.size || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        size: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="stock-size">
                      <SelectValue placeholder="All sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sizes</SelectItem>
                      {sizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-micron">Micron</Label>
                  <Select
                    value={filters.micron || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        micron: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="stock-micron">
                      <SelectValue placeholder="All microns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All microns</SelectItem>
                      {micronOptions.map((micron) => (
                        <SelectItem key={micron} value={String(micron)}>
                          {micron} micron
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
              <CardTitle>Current stock</CardTitle>
              <CardDescription>
                Aggregated balance for each roll type, size and micron.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : filteredStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No stock matches these filters yet. Record an incoming entry to
                  build up stock.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Micron</TableHead>
                        <TableHead className="text-right">Incoming</TableHead>
                        <TableHead className="text-right">Outgoing</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStock.map((row) => (
                        <TableRow
                          key={`${row.roll_type}-${row.size}-${row.micron}`}
                        >
                          <TableCell>
                            <Badge variant="secondary">{row.roll_type}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{row.size}</TableCell>
                          <TableCell className="text-sm">{row.micron}</TableCell>
                          <TableCell className="text-right text-sm">
                            {formatKg(row.incoming_kg)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatKg(row.outgoing_kg)}
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">
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

        <TabsContent value="entry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record a film roll entry</CardTitle>
              <CardDescription>
                Incoming entries add to the stock for that size and micron.
                Outgoing entries deduct from it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="direction">Entry type</Label>
                  <div
                    id="direction"
                    role="radiogroup"
                    aria-label="Entry type"
                    className="grid grid-cols-2 gap-2"
                  >
                    <Button
                      type="button"
                      variant={form.direction === "in" ? "default" : "outline"}
                      aria-pressed={form.direction === "in"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, direction: "in" }))
                      }
                    >
                      <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                      Incoming
                    </Button>
                    <Button
                      type="button"
                      variant={form.direction === "out" ? "default" : "outline"}
                      aria-pressed={form.direction === "out"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, direction: "out" }))
                      }
                    >
                      <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
                      Outgoing
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="roll-type">Roll type</Label>
                    <Select
                      value={form.roll_type}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          roll_type: value as RollType,
                        }))
                      }
                    >
                      <SelectTrigger id="roll-type">
                        <SelectValue placeholder="Select roll type" />
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
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      name="size"
                      value={form.size}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, size: event.target.value }))
                      }
                      placeholder="e.g. 500 mm"
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="micron">Micron</Label>
                    <Input
                      id="micron"
                      name="micron"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={form.micron}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, micron: event.target.value }))
                      }
                      placeholder="e.g. 40"
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Total weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
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
                      placeholder="e.g. 250"
                      disabled={createMutation.isPending}
                      required
                    />
                  </div>

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
                      placeholder="e.g. Bengal Plastics"
                      disabled={createMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movement-date">Date</Label>
                    <Input
                      id="movement-date"
                      name="movement-date"
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
                    placeholder="Optional remarks about this entry"
                    rows={3}
                    disabled={createMutation.isPending}
                  />
                </div>

                {formError ? (
                  <Alert variant="destructive" role="alert">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                {formNotice ? (
                  <Alert role="status">
                    <AlertDescription>{formNotice}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Save entry
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={createMutation.isPending}
                    onClick={() => {
                      setForm({ ...EMPTY_FORM, movement_date: todayISO() });
                      setFormError(null);
                      setFormNotice(null);
                    }}
                  >
                    Reset form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent entries</CardTitle>
              <CardDescription>
                Latest film roll movements recorded by staff.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : movements.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No entries recorded yet. Use the form above to add the first one.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Roll</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Recorded by</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements.slice(0, 20).map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="whitespace-nowrap text-sm">
                            {formatDate(movement.movement_date)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                movement.direction === "in"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {movement.direction === "in" ? "In" : "Out"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.roll_type} · {movement.size} ·{" "}
                            {movement.micron} micron
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.supplier || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.created_by_name || "—"}
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">
                            {formatKg(movement.weight_kg)}
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

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report filters</CardTitle>
              <CardDescription>
                Build a custom report by roll type, size, micron and date range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="report-roll-type">Roll type</Label>
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
                      <SelectValue placeholder="All roll types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roll types</SelectItem>
                      {ROLL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-size">Size</Label>
                  <Select
                    value={filters.size || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        size: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="report-size">
                      <SelectValue placeholder="All sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sizes</SelectItem>
                      {sizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-micron">Micron</Label>
                  <Select
                    value={filters.micron || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        micron: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger id="report-micron">
                      <SelectValue placeholder="All microns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All microns</SelectItem>
                      {micronOptions.map((micron) => (
                        <SelectItem key={micron} value={String(micron)}>
                          {micron} micron
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-from">From date</Label>
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
                  <Label htmlFor="report-to">To date</Label>
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
                    Clear filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Incoming in range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(reportTotals.incoming)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Outgoing in range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(reportTotals.outgoing)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net movement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatKg(reportTotals.incoming - reportTotals.outgoing)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movement report</CardTitle>
              <CardDescription>
                {reportRows.length} movement{reportRows.length === 1 ? "" : "s"}{" "}
                match the selected filters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : reportRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No movements match these filters. Adjust the filters or record a
                  new entry.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Roll type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Micron</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Recorded by</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
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
                                movement.direction === "in"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {movement.direction === "in" ? "In" : "Out"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.roll_type}
                          </TableCell>
                          <TableCell className="text-sm">{movement.size}</TableCell>
                          <TableCell className="text-sm">
                            {movement.micron}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.supplier || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.created_by_name || "—"}
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">
                            {formatKg(movement.weight_kg)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Stock summary for filters</CardTitle>
              <CardDescription>
                Aggregated balance for the roll types, sizes and microns selected
                above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : filteredStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No stock matches the selected filters.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Micron</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStock.map((row) => (
                        <TableRow
                          key={`summary-${row.roll_type}-${row.size}-${row.micron}`}
                        >
                          <TableCell>
                            <Badge variant="secondary">{row.roll_type}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{row.size}</TableCell>
                          <TableCell className="text-sm">{row.micron}</TableCell>
                          <TableCell className="text-right text-sm font-semibold">
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
      </Tabs>
    </div>
  );
}

export default FilmRollsPage;
