// hooks/useAppointments.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ApptStatus = "pending" | "in_process" | "completed";

export type Appointment = {
  id: string;
  carName: string;
  year?: string;
  plate?: string;
  service: string;
  datetime: string;     // ISO string
  status: ApptStatus;   // "pending" | "in_process" | "completed"
  // opcionales por si luego quieres mostrar más datos
  clientName?: string;
  clientPhone?: string;
  notes?: string;
};

type AppointmentsCtx = {
  appts: Appointment[];
  add: (a: Appointment) => void;
  update: (id: string, patch: Partial<Appointment>) => void;
  setStatus: (id: string, status: ApptStatus) => void;
  toggleDone: (id: string) => void; // pending/in_process -> completed, completed -> pending
  remove: (id: string) => void;
  clearAll: () => void;
};

const STORAGE_KEY = "appointments:v1";
const Ctx = createContext<AppointmentsCtx | null>(null);

/** Pequeño debounce para no escribir en storage en cada tecla */
function useDebouncedEffect(effect: () => void, deps: any[], delay = 250) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(effect, delay);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cargar de AsyncStorage (con migración simple si antes no había status)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: any[] = JSON.parse(raw);
          const fixed: Appointment[] = parsed.map((a) => ({
            ...a,
            status: (a.status as ApptStatus) ?? "pending",
          }));
          setAppts(fixed);
        }
      } catch (e) {
        console.warn("No se pudo cargar citas:", e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Guardar en AsyncStorage (debounced)
  useDebouncedEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appts)).catch((e) =>
      console.warn("No se pudo guardar citas:", e)
    );
  }, [appts, hydrated], 250);

  // --- acciones CRUD ---
  const add: AppointmentsCtx["add"] = (a) => {
    setAppts((prev) => [{ ...a }, ...prev]);
  };

  const update: AppointmentsCtx["update"] = (id, patch) => {
    setAppts((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const setStatus: AppointmentsCtx["setStatus"] = (id, status) => {
    setAppts((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const toggleDone: AppointmentsCtx["toggleDone"] = (id) => {
    setAppts((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        // si está completed -> vuelve a pending, si no -> pásalo a completed
        const next: ApptStatus = x.status === "completed" ? "pending" : "completed";
        return { ...x, status: next };
      })
    );
  };

  const remove: AppointmentsCtx["remove"] = (id) => {
    setAppts((prev) => prev.filter((x) => x.id !== id));
  };

  const clearAll = () => setAppts([]);

  const value = useMemo<AppointmentsCtx>(
    () => ({ appts, add, update, setStatus, toggleDone, remove, clearAll }),
    [appts]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppointments() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppointments debe usarse dentro de AppointmentsProvider");
  return ctx;
}
