// app/_layout.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppointmentsProvider } from "../hooks/useAppointments"; // 👈 ruta correcta desde app/_layout.tsx

type Session = { email: string; role: string } | null;

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<Session>(null);
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("session");
        setUser(raw ? JSON.parse(raw) : null);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  if (!hydrated) return null;

  const inAuth = segments[0] === "(auth)";

  if (!user && !inAuth) return <Redirect href="/login" />;
  if (user && inAuth) return <Redirect href="/" />;

  return (
    <AppointmentsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AppointmentsProvider>
  );
}
