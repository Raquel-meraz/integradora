// app/services/revenue.ts
// Capa de dominio para ingresos: interface + adaptadores

export type DateRange = { start: Date; end: Date };
export type RevenuePoint = { date: string; total: number };      // YYYY-MM-DD
export type ServiceTotal = { service: string; total: number };

export interface RevenueSource {
  dailyTotal(date: Date): Promise<number>;
  seriesByDay(range: DateRange): Promise<RevenuePoint[]>;
  topServices(range: DateRange, limit?: number): Promise<ServiceTotal[]>;
}

// ===== utilidades de fecha =====
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const fmtYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const rangeFor = (preset: "today" | "week" | "month", ref = new Date()): DateRange => {
  const today = startOfDay(ref);
  if (preset === "today") return { start: today, end: endOfDay(today) };

  if (preset === "week") {
    // lunes-domingo
    const day = today.getDay();               // 0=domingo, 1=lunes...
    const diffToMonday = (day + 6) % 7;       // 0->6, 1->0, ..., 6->5
    const monday = addDays(today, -diffToMonday);
    const sunday = endOfDay(addDays(monday, 6));
    return { start: monday, end: sunday };
  }

  // month
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = endOfDay(new Date(ref.getFullYear(), ref.getMonth() + 1, 0));
  return { start, end };
};

// ===== Adaptador desde citas en memoria =====
type MinimalAppt = {
  datetime: string;                 // ISO
  status: "pending" | "completed";
  service: string;
};

export function createRevenueFromAppointments(
  appts: MinimalAppt[],
  priceMap: Record<string, number>
): RevenueSource {
  const amountFor = (a: MinimalAppt) => priceMap[a.service] ?? 0;

  const inRange = (iso: string, r: DateRange) => {
    const t = new Date(iso).getTime();
    return t >= r.start.getTime() && t <= r.end.getTime();
  };

  return {
    async dailyTotal(date: Date) {
      const r = { start: startOfDay(date), end: endOfDay(date) };
      return appts
        .filter(a => a.status === "completed" && inRange(a.datetime, r))
        .reduce((s, a) => s + amountFor(a), 0);
    },

    async seriesByDay(range: DateRange) {
      // construye un punto por día dentro del rango
      const points: RevenuePoint[] = [];
      for (let d = startOfDay(range.start); d <= range.end; d = addDays(d, 1)) {
        const dayRange = { start: startOfDay(d), end: endOfDay(d) };
        const total = appts
          .filter(a => a.status === "completed" && inRange(a.datetime, dayRange))
          .reduce((s, a) => s + amountFor(a), 0);
        points.push({ date: fmtYMD(d), total });
      }
      return points;
    },

    async topServices(range: DateRange, limit = 10) {
      const byService = new Map<string, number>();
      appts
        .filter(a => a.status === "completed" && inRange(a.datetime, range))
        .forEach(a => {
          const prev = byService.get(a.service) ?? 0;
          byService.set(a.service, prev + amountFor(a));
        });

      return Array.from(byService.entries())
        .map(([service, total]) => ({ service, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
    },
  };
}

// ===== EJEMPLO de firma para un adaptador de API (cuando tengas backend) =====
// Implementa las mismas funciones y retorna el mismo tipo.
export function createRevenueFromApi(baseUrl: string, token?: string): RevenueSource {
  const doFetch = async (path: string, init?: RequestInit) => {
    const res = await fetch(baseUrl + path, {
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  return {
    async dailyTotal(date) {
      const ymd = fmtYMD(date);
      const data = await doFetch(`/revenue/daily?date=${ymd}`);
      return data.total ?? 0;
    },
    async seriesByDay(range) {
      const q = `start=${fmtYMD(range.start)}&end=${fmtYMD(range.end)}`;
      const data = await doFetch(`/revenue/seriesByDay?${q}`);
      return data.points as RevenuePoint[];
    },
    async topServices(range, limit = 10) {
      const q = `start=${fmtYMD(range.start)}&end=${fmtYMD(range.end)}&limit=${limit}`;
      const data = await doFetch(`/revenue/topServices?${q}`);
      return data.items as ServiceTotal[];
    },
  };
}
