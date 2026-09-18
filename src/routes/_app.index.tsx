import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Loader2,
  Package,
  Scale,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  aggregateFilmRollStock,
  aggregateGranuleStock,
  fetchFilmRollMovements,
  fetchGranuleMovements,
  filmRollByType,
  filmRollTotals,
  formatKg,
  granuleTotals,
  ROLL_TYPES,
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

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
});

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Scale;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const { displayName } = useAuth();

  const filmQuery = useQuery({
    queryKey: ["dashboard", "film-roll-movements"],
    queryFn: () => fetchFilmRollMovements(),
  });

  const granuleQuery = useQuery({
    queryKey: ["dashboard", "granule-movements"],
    queryFn: () => fetchGranuleMovements(),
  });

  const filmRows = useMemo(
    () => aggregateFilmRollStock(filmQuery.data ?? []),
    [filmQuery.data],
  );
  const granuleRows = useMemo(
    () => aggregateGranuleStock(granuleQuery.data ?? []),
    [granuleQuery.data],
  );

  const filmTotals = useMemo(() => filmRollTotals(filmRows), [filmRows]);
  const granuleTotalsValue = useMemo(
    () => granuleTotals(granuleRows),
    [granuleRows],
  );
  const byType = useMemo(() => filmRollByType(filmRows), [filmRows]);

  const loading = filmQuery.isLoading || granuleQuery.isLoading;
  const errorMessage =
    (filmQuery.error instanceof Error ? filmQuery.error.message : null) ??
    (granuleQuery.error instanceof Error ? granuleQuery.error.message : null);

  const recentFilm = (filmQuery.data ?? []).slice(0, 5);
  const recentGranules = (granuleQuery.data ?? []).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Inventory dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {displayName}. Live stock position across film rolls and
            granules.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/film">
              <Package className="h-4 w-4" aria-hidden="true" />
              Film rolls
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/granules">
              <Boxes className="h-4 w-4" aria-hidden="true" />
              Granules
            </Link>
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Could not load inventory</AlertTitle>
          <AlertDescription>
            {errorMessage} Check your connection and try again.
          </AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Film roll stock"
            value={formatKg(filmTotals.balance)}
            hint={`${filmRows.length} size/micron combination${
              filmRows.length === 1 ? "" : "s"
            }`}
            icon={Package}
          />
          <StatCard
            label="Granule stock"
            value={formatKg(granuleTotalsValue.balance)}
            hint={`${granuleRows.length} grade/batch combination${
              granuleRows.length === 1 ? "" : "s"
            }`}
            icon={Boxes}
          />
          <StatCard
            label="Total received"
            value={formatKg(filmTotals.incoming + granuleTotalsValue.incoming)}
            hint="Film rolls and granules combined"
            icon={ArrowDownToLine}
          />
          <StatCard
            label="Total issued"
            value={formatKg(filmTotals.outgoing + granuleTotalsValue.outgoing)}
            hint="Film rolls and granules combined"
            icon={ArrowUpFromLine}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Film roll stock by type</CardTitle>
            <CardDescription>
              Current balance for BOPP, CPP and PP rolls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {byType.map((row) => (
                  <li
                    key={row.roll_type}
                    className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Badge variant="secondary">{row.roll_type}</Badge>
                    </span>
                    <span className="text-sm font-semibold">
                      {formatKg(row.balance_kg)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module totals</CardTitle>
            <CardDescription>
              Incoming versus outgoing for each independent module.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">Film rolls</p>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">In</dt>
                      <dd className="font-semibold">
                        {formatKg(filmTotals.incoming)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Out</dt>
                      <dd className="font-semibold">
                        {formatKg(filmTotals.outgoing)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Balance</dt>
                      <dd className="font-semibold">
                        {formatKg(filmTotals.balance)}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">Granules</p>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">In</dt>
                      <dd className="font-semibold">
                        {formatKg(granuleTotalsValue.incoming)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Out</dt>
                      <dd className="font-semibold">
                        {formatKg(granuleTotalsValue.outgoing)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Balance</dt>
                      <dd className="font-semibold">
                        {formatKg(granuleTotalsValue.balance)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Recent film roll activity</CardTitle>
              <CardDescription>Latest five movements.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/film">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : recentFilm.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No film roll entries yet. Record incoming stock to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFilm.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {movement.movement_date}
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
                      <TableCell className="text-sm">
                        {movement.roll_type} · {movement.size} · {movement.micron}
                        µ
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatKg(movement.weight_kg)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Recent granule activity</CardTitle>
              <CardDescription>Latest five movements.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/granules">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : recentGranules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No granule entries yet. Record incoming stock to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Grade / batch</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentGranules.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {movement.movement_date}
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
                      <TableCell className="text-sm">
                        {movement.grade} · {movement.batch_number}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatKg(movement.weight_kg)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roll types tracked</CardTitle>
          <CardDescription>
            Film roll stock is aggregated by roll type, size and micron.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {ROLL_TYPES.map((type) => (
            <Badge key={type} variant="outline">
              {type}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
