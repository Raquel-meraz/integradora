// hooks/useAppointments.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

type Appointment = {
  id: string;
  carName: string;
  year?: string;
  plate?: string;
  service: string;
  datetime: string; // ISO
  status: "pending" | "completed";
};

type Ctx = {
  appts: Appointment[];
  add: (a: Appointment) => void;
  toggleDone: (id: string) => void;
  remove: (id: string) => void;
};

const AppointmentsCtx = createContext<Ctx | null>(null);

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const add = (a: Appointment) => setAppts(prev => [a, ...prev]);
  const toggleDone = (id: string) =>
    setAppts(prev =>
      prev.map(x => (x.id === id ? { ...x, status: x.status === "pending" ? "completed" : "pending" } : x))
    );
  const remove = (id: string) => setAppts(prev => prev.filter(x => x.id !== id));

  const value = useMemo(() => ({ appts, add, toggleDone, remove }), [appts]);
  return <AppointmentsCtx.Provider value={value}>{children}</AppointmentsCtx.Provider>;
}

export function useAppointments() {
  const ctx = useContext(AppointmentsCtx);
  if (!ctx) throw new Error("useAppointments debe usarse dentro de AppointmentsProvider");
  return ctx;
}

export type { Appointment };
