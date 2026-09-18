import { supabase } from "@/lib/supabase";

export type Direction = "in" | "out";
export type RollType = "BOPP" | "CPP" | "PP";

export type FilmRollMovement = {
  id: string;
  direction: Direction;
  roll_type: RollType;
  size: string;
  micron: number;
  weight_kg: number;
  supplier: string;
  notes: string;
  movement_date: string;
  created_by: string | null;
  created_by_name: string;
  created_at: string;
  updated_at: string;
};

export type GranuleMovement = {
  id: string;
  direction: Direction;
  grade: string;
  batch_number: string;
  supplier: string;
  machine: string;
  weight_kg: number;
  notes: string;
  movement_date: string;
  created_by: string | null;
  created_by_name: string;
  created_at: string;
  updated_at: string;
};

export type FilmRollStockRow = {
  roll_type: RollType;
  size: string;
  micron: number;
  incoming_kg: number;
  outgoing_kg: number;
  balance_kg: number;
};

export type GranuleStockRow = {
  grade: string;
  batch_number: string;
  incoming_kg: number;
  outgoing_kg: number;
  balance_kg: number;
};

export type FilmRollFilters = {
  rollType?: RollType | "all";
  size?: string;
  micron?: string;
  from?: string;
  to?: string;
};

export type GranuleFilters = {
  grade?: string;
  batchNumber?: string;
  supplier?: string;
  from?: string;
  to?: string;
};

export const ROLL_TYPES: RollType[] = ["BOPP", "CPP", "PP"];

export const FILM_ROLL_SELECT =
  "id, direction, roll_type, size, micron, weight_kg, supplier, notes, movement_date, created_by, created_by_name, created_at, updated_at";

export const GRANULE_SELECT =
  "id, direction, grade, batch_number, supplier, machine, weight_kg, notes, movement_date, created_by, created_by_name, created_at, updated_at";

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeFilmRoll(row: Record<string, unknown>): FilmRollMovement {
  return {
    id: String(row.id),
    direction: row.direction === "out" ? "out" : "in",
    roll_type: (row.roll_type as RollType) ?? "BOPP",
    size: String(row.size ?? ""),
    micron: toNumber(row.micron),
    weight_kg: toNumber(row.weight_kg),
    supplier: String(row.supplier ?? ""),
    notes: String(row.notes ?? ""),
    movement_date: String(row.movement_date ?? ""),
    created_by: (row.created_by as string | null) ?? null,
    created_by_name: String(row.created_by_name ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function normalizeGranule(row: Record<string, unknown>): GranuleMovement {
  return {
    id: String(row.id),
    direction: row.direction === "out" ? "out" : "in",
    grade: String(row.grade ?? ""),
    batch_number: String(row.batch_number ?? ""),
    supplier: String(row.supplier ?? ""),
    machine: String(row.machine ?? ""),
    weight_kg: toNumber(row.weight_kg),
    notes: String(row.notes ?? ""),
    movement_date: String(row.movement_date ?? ""),
    created_by: (row.created_by as string | null) ?? null,
    created_by_name: String(row.created_by_name ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export function formatKg(value: number): string {
  return `${toNumber(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })} kg`;
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function aggregateFilmRollStock(
  movements: FilmRollMovement[],
): FilmRollStockRow[] {
  const map = new Map<string, FilmRollStockRow>();

  for (const movement of movements) {
    const key = `${movement.roll_type}|${movement.size}|${movement.micron}`;
    const existing = map.get(key) ?? {
      roll_type: movement.roll_type,
      size: movement.size,
      micron: movement.micron,
      incoming_kg: 0,
      outgoing_kg: 0,
      balance_kg: 0,
    };

    if (movement.direction === "in") {
      existing.incoming_kg += movement.weight_kg;
    } else {
      existing.outgoing_kg += movement.weight_kg;
    }
    existing.balance_kg = existing.incoming_kg - existing.outgoing_kg;
    map.set(key, existing);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.roll_type !== b.roll_type) return a.roll_type.localeCompare(b.roll_type);
    if (a.size !== b.size) return a.size.localeCompare(b.size);
    return a.micron - b.micron;
  });
}

export function aggregateGranuleStock(
  movements: GranuleMovement[],
): GranuleStockRow[] {
  const map = new Map<string, GranuleStockRow>();

  for (const movement of movements) {
    const key = `${movement.grade}|${movement.batch_number}`;
    const existing = map.get(key) ?? {
      grade: movement.grade,
      batch_number: movement.batch_number,
      incoming_kg: 0,
      outgoing_kg: 0,
      balance_kg: 0,
    };

    if (movement.direction === "in") {
      existing.incoming_kg += movement.weight_kg;
    } else {
      existing.outgoing_kg += movement.weight_kg;
    }
    existing.balance_kg = existing.incoming_kg - existing.outgoing_kg;
    map.set(key, existing);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
    return a.batch_number.localeCompare(b.batch_number);
  });
}

export function filmRollTotals(rows: FilmRollStockRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.incoming += row.incoming_kg;
      acc.outgoing += row.outgoing_kg;
      acc.balance += row.balance_kg;
      return acc;
    },
    { incoming: 0, outgoing: 0, balance: 0 },
  );
}

export function granuleTotals(rows: GranuleStockRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.incoming += row.incoming_kg;
      acc.outgoing += row.outgoing_kg;
      acc.balance += row.balance_kg;
      return acc;
    },
    { incoming: 0, outgoing: 0, balance: 0 },
  );
}

export function filmRollByType(rows: FilmRollStockRow[]) {
  const map = new Map<RollType, number>();
  for (const type of ROLL_TYPES) map.set(type, 0);
  for (const row of rows) {
    map.set(row.roll_type, (map.get(row.roll_type) ?? 0) + row.balance_kg);
  }
  return ROLL_TYPES.map((type) => ({
    roll_type: type,
    balance_kg: map.get(type) ?? 0,
  }));
}

export async function fetchFilmRollMovements(
  filters: FilmRollFilters = {},
): Promise<FilmRollMovement[]> {
  let query = supabase
    .from("film_roll_movements")
    .select(FILM_ROLL_SELECT)
    .order("movement_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.rollType && filters.rollType !== "all") {
    query = query.eq("roll_type", filters.rollType);
  }
  if (filters.size && filters.size.trim()) {
    query = query.eq("size", filters.size.trim());
  }
  if (filters.micron && filters.micron.trim()) {
    const micron = Number(filters.micron);
    if (Number.isFinite(micron)) {
      query = query.eq("micron", micron);
    }
  }
  if (filters.from) {
    query = query.gte("movement_date", filters.from);
  }
  if (filters.to) {
    query = query.lte("movement_date", filters.to);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeFilmRoll(row as Record<string, unknown>));
}

export async function fetchGranuleMovements(
  filters: GranuleFilters = {},
): Promise<GranuleMovement[]> {
  let query = supabase
    .from("granule_movements")
    .select(GRANULE_SELECT)
    .order("movement_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.grade && filters.grade.trim()) {
    query = query.eq("grade", filters.grade.trim());
  }
  if (filters.batchNumber && filters.batchNumber.trim()) {
    query = query.eq("batch_number", filters.batchNumber.trim());
  }
  if (filters.supplier && filters.supplier.trim()) {
    query = query.eq("supplier", filters.supplier.trim());
  }
  if (filters.from) {
    query = query.gte("movement_date", filters.from);
  }
  if (filters.to) {
    query = query.lte("movement_date", filters.to);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeGranule(row as Record<string, unknown>));
}

export type FilmRollInput = {
  direction: Direction;
  roll_type: RollType;
  size: string;
  micron: number;
  weight_kg: number;
  supplier: string;
  notes: string;
  movement_date: string;
};

export type GranuleInput = {
  direction: Direction;
  grade: string;
  batch_number: string;
  supplier: string;
  machine: string;
  weight_kg: number;
  notes: string;
  movement_date: string;
};

export async function createFilmRollMovement(
  input: FilmRollInput,
  user: { id: string; name: string },
): Promise<FilmRollMovement> {
  const { data, error } = await supabase
    .from("film_roll_movements")
    .insert({
      direction: input.direction,
      roll_type: input.roll_type,
      size: input.size.trim(),
      micron: input.micron,
      weight_kg: input.weight_kg,
      supplier: input.supplier.trim(),
      notes: input.notes.trim(),
      movement_date: input.movement_date,
      created_by: user.id,
      created_by_name: user.name,
    })
    .select(FILM_ROLL_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return normalizeFilmRoll(data as Record<string, unknown>);
}

export async function createGranuleMovement(
  input: GranuleInput,
  user: { id: string; name: string },
): Promise<GranuleMovement> {
  const { data, error } = await supabase
    .from("granule_movements")
    .insert({
      direction: input.direction,
      grade: input.grade.trim(),
      batch_number: input.batch_number.trim(),
      supplier: input.supplier.trim(),
      machine: input.machine.trim(),
      weight_kg: input.weight_kg,
      notes: input.notes.trim(),
      movement_date: input.movement_date,
      created_by: user.id,
      created_by_name: user.name,
    })
    .select(GRANULE_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return normalizeGranule(data as Record<string, unknown>);
}

export async function deleteFilmRollMovement(id: string): Promise<void> {
  const { error } = await supabase
    .from("film_roll_movements")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteGranuleMovement(id: string): Promise<void> {
  const { error } = await supabase.from("granule_movements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function uniqueValues(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  ).sort((a, b) => a.localeCompare(b));
}

export function uniqueMicrons(movements: FilmRollMovement[]): number[] {
  return Array.from(new Set(movements.map((movement) => movement.micron))).sort(
    (a, b) => a - b,
  );
}
