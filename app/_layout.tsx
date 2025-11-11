// app/_layout.tsx
import React from "react";
import { Stack, Redirect, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { AppointmentsProvider } from "../hooks/useAppointments";

function RootNavigator() {
  const { user, ready } = useAuth();
  const segments = useSegments();
  const inAuth = segments[0] === "(auth)";

  if (!ready) return null;

  // sin sesión → solo login
  if (!user) {
    if (!inAuth) return <Redirect href="/login" />;
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  // con sesión → siempre tabs (ahí se decide admin/cliente)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <AppointmentsProvider>
        <RootNavigator />
      </AppointmentsProvider>
    </AuthProvider>
  );
}
