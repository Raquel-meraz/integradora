// hooks/useAuth.tsx  contraseñas establecidas
import React, { createContext, useContext, useMemo, useState } from "react";

type Role = "admin" | "client";
type User = { email: string; role: Role };

type AuthCtx = {
  user: User | null;
  ready: boolean; // si luego quieres cargar/persistir, te sirve
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

// Cuentas fijas (mock)
const USERS: Record<string, { password: string; role: Role }> = {
  "admin@gmail.com": { password: "12345", role: "admin" },
  "cliente@gmail.com": { password: "67890", role: "client" },
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready: true, // si persistes, cámbialo tras cargar
      async login(email, password) {
        const key = email.trim().toLowerCase();
        const found = USERS[key];
        if (!found || found.password !== password) {
          return { ok: false, error: "Correo o contraseña incorrectos." };
        }
        setUser({ email: key, role: found.role });
        return { ok: true };
      },
      logout() {
        setUser(null);
      },
    }),
    [user]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
