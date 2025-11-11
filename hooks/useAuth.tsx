// app/hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Role = "admin" | "client";
type User = { email: string; role: Role };

type AuthCtx = {
  user: User | null;
  ready: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
};

// cuentas de prueba
const USERS: Record<string, { password: string; role: Role }> = {
  "admin@gmail.com": { password: "12345", role: "admin" },
  "cliente@gmail.com": { password: "67890", role: "client" },
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // cargar sesión guardada
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("session");
        if (raw) {
          const parsed = JSON.parse(raw) as User;
          setUser(parsed);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,

      async login(email, password) {
        const key = email.trim().toLowerCase();
        const found = USERS[key];
        if (!found || found.password !== password) {
          return { ok: false, error: "Correo o contraseña incorrectos." };
        }

        const logged: User = { email: key, role: found.role };
        setUser(logged);
        await AsyncStorage.setItem("session", JSON.stringify(logged));
        // 👇 aquí está el cambio
        return { ok: true, user: logged };
      },

      async logout() {
        setUser(null);
        await AsyncStorage.removeItem("session");
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
