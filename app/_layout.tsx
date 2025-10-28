import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppointmentsProvider } from "../hooks/useAppointments";

type Session = { email: string; role: "admin" | "client" } | null;

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session>(null);
  const segments = useSegments();

  // Cargar sesión al iniciar
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("session");
        setSession(raw ? JSON.parse(raw) : null);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Releer sesión cuando cambie la ruta (tras login/logout)
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("session");
      setSession(raw ? JSON.parse(raw) : null);
    })();
  }, [segments]);

  if (!hydrated) return null;

  const inAuth = segments[0] === "(auth)";

  // SIN sesión: siempre forzar a /login
  if (!session) {
    if (!inAuth) return <Redirect href="/login" />;
  } else {
    // CON sesión: si está en auth, redirige al home según rol
    if (inAuth) {
      return <Redirect href={session.role === "admin" ? "/" : "/cliente"} />;
    }
  }

  return (
    // 👇 Hace disponible useAppointments() en TODA la app
    <AppointmentsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth (login, register, etc.) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Admin: tu app con tabs está en el grupo (tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Cliente */}
        <Stack.Screen name="cliente/index" options={{ headerShown: false }} />
      </Stack>
    </AppointmentsProvider>
  );
}
