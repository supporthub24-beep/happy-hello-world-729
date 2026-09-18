import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type Direction = "in" | "out";

export type RollType = "BOPP" | "CPP" | "PP";

export const ROLL_TYPES: RollType[] = ["BOPP", "CPP", "PP"];

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  "Supabase কনফিগার করা নেই। VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY সেট করুন।";

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

export type FilmRollEntryInput = {
  direction: Direction;
  roll_type: RollType;
  size: string;
  micron: number;
  weight_kg: number;
  supplier: string;
  notes: string;
  movement_date: string;
};

export type GranuleEntryInput = {
  direction: Direction;
  grade: string;
  batch_number: string;
  supplier: string;
  machine: string;
  weight_kg: number;
  notes: string;
  movement_date: string;
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
  batch?: string;
  supplier?: string;
  from?: string;
  to?: string;
};

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeFilmRoll(row: Record<string, unknown>): FilmRollMovement {
  return {
    id: String(row.id ?? ""),
    direction: (row.direction === "out" ? "out" : "in") as Direction,
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
    id: String(row.id ?? ""),
    direction: (row.direction === "out" ? "out" : "in") as Direction,
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

export function aggregateFilmRollStock(
  movements: FilmRollMovement[],
): FilmRollStockRow[] {
  const map = new Map<string, FilmRollStockRow>();

  for (const movement of movements) {
    const key = `${movement.roll_type}__${movement.size}__${movement.micron}`;
    const existing =
      map.get(key) ??
      ({
        roll_type: movement.roll_type,
        size: movement.size,
        micron: movement.micron,
        incoming_kg: 0,
        outgoing_kg: 0,
        balance_kg: 0,
      } satisfies FilmRollStockRow);

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
    const key = `${movement.grade}__${movement.batch_number}`;
    const existing =
      map.get(key) ??
      ({
        grade: movement.grade,
        batch_number: movement.batch_number,
        incoming_kg: 0,
        outgoing_kg: 0,
        balance_kg: 0,
      } satisfies GranuleStockRow);

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

export function filmRollTotals(movements: FilmRollMovement[]) {
  let incoming = 0;
  let outgoing = 0;
  for (const movement of movements) {
    if (movement.direction === "in") incoming += movement.weight_kg;
    else outgoing += movement.weight_kg;
  }
  return { incoming, outgoing, balance: incoming - outgoing };
}

export function granuleTotals(movements: GranuleMovement[]) {
  let incoming = 0;
  let outgoing = 0;
  for (const movement of movements) {
    if (movement.direction === "in") incoming += movement.weight_kg;
    else outgoing += movement.weight_kg;
  }
  return { incoming, outgoing, balance: incoming - outgoing };
}

export function filmRollBreakdownByType(movements: FilmRollMovement[]) {
  const map = new Map<RollType, { incoming: number; outgoing: number; balance: number }>();
  for (const type of ROLL_TYPES) {
    map.set(type, { incoming: 0, outgoing: 0, balance: 0 });
  }
  for (const movement of movements) {
    const bucket = map.get(movement.roll_type);
    if (!bucket) continue;
    if (movement.direction === "in") bucket.incoming += movement.weight_kg;
    else bucket.outgoing += movement.weight_kg;
    bucket.balance = bucket.incoming - bucket.outgoing;
  }
  return ROLL_TYPES.map((type) => ({
    roll_type: type,
    ...(map.get(type) ?? { incoming: 0, outgoing: 0, balance: 0 }),
  }));
}

export function granuleBreakdownByGrade(movements: GranuleMovement[]) {
  const map = new Map<string, { incoming: number; outgoing: number; balance: number }>();
  for (const movement of movements) {
    const bucket =
      map.get(movement.grade) ?? { incoming: 0, outgoing: 0, balance: 0 };
    if (movement.direction === "in") bucket.incoming += movement.weight_kg;
    else bucket.outgoing += movement.weight_kg;
    bucket.balance = bucket.incoming - bucket.outgoing;
    map.set(movement.grade, bucket);
  }
  return Array.from(map.entries())
    .map(([grade, totals]) => ({ grade, ...totals }))
    .sort((a, b) => a.grade.localeCompare(b.grade));
}

export function filterFilmRollMovements(
  movements: FilmRollMovement[],
  filters: FilmRollFilters,
): FilmRollMovement[] {
  const size = filters.size?.trim().toLowerCase() ?? "";
  const micron = filters.micron?.trim() ?? "";
  return movements.filter((movement) => {
    if (filters.rollType && filters.rollType !== "all" && movement.roll_type !== filters.rollType) {
      return false;
    }
    if (size && !movement.size.toLowerCase().includes(size)) return false;
    if (micron && String(movement.micron) !== micron) return false;
    if (filters.from && movement.movement_date < filters.from) return false;
    if (filters.to && movement.movement_date > filters.to) return false;
    return true;
  });
}

export function filterGranuleMovements(
  movements: GranuleMovement[],
  filters: GranuleFilters,
): GranuleMovement[] {
  const grade = filters.grade?.trim().toLowerCase() ?? "";
  const batch = filters.batch?.trim().toLowerCase() ?? "";
  const supplier = filters.supplier?.trim().toLowerCase() ?? "";
  return movements.filter((movement) => {
    if (grade && !movement.grade.toLowerCase().includes(grade)) return false;
    if (batch && !movement.batch_number.toLowerCase().includes(batch)) return false;
    if (supplier && !movement.supplier.toLowerCase().includes(supplier)) return false;
    if (filters.from && movement.movement_date < filters.from) return false;
    if (filters.to && movement.movement_date > filters.to) return false;
    return true;
  });
}

export async function fetchFilmRollMovements(): Promise<FilmRollMovement[]> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
  }

  const { data, error } = await supabase
    .from("film_roll_movements")
    .select("*")
    .order("movement_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeFilmRoll(row as Record<string, unknown>));
}

export async function fetchGranuleMovements(): Promise<GranuleMovement[]> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
  }

  const { data, error } = await supabase
    .from("granule_movements")
    .select("*")
    .order("movement_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeGranule(row as Record<string, unknown>));
}

export async function createFilmRollMovement(
  input: FilmRollEntryInput,
  staff: { id: string | null; name: string },
): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
  }

  const { error } = await supabase.from("film_roll_movements").insert({
    direction: input.direction,
    roll_type: input.roll_type,
    size: input.size.trim(),
    micron: input.micron,
    weight_kg: input.weight_kg,
    supplier: input.supplier.trim(),
    notes: input.notes.trim(),
    movement_date: input.movement_date,
    created_by: staff.id,
    created_by_name: staff.name,
  });

  if (error) throw new Error(error.message);
}

export async function createGranuleMovement(
  input: GranuleEntryInput,
  staff: { id: string | null; name: string },
): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
  }

  const { error } = await supabase.from("granule_movements").insert({
    direction: input.direction,
    grade: input.grade.trim(),
    batch_number: input.batch_number.trim(),
    supplier: input.supplier.trim(),
    machine: input.machine.trim(),
    weight_kg: input.weight_kg,
    notes: input.notes.trim(),
    movement_date: input.movement_date,
    created_by: staff.id,
    created_by_name: staff.name,
  });

  if (error) throw new Error(error.message);
}

export async function deleteFilmRollMovement(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
  }

  const { error } = await supabase.from("film_roll_movements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteGranuleMovement(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
  }

  const { error } = await supabase.from("granule_movements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function formatKg(value: number): string {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })} কেজি`;
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
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
