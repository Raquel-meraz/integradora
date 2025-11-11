// app/(tabs)/index.tsx
import React from "react";
import { useAuth } from "../../hooks/useAuth";  // 👈 cambió a ../../
import ClienteHome from "../cliente/index";
import AdminHome from "../(admin)/index";

export default function TabsHome() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  return isAdmin ? <AdminHome /> : <ClienteHome />;
}
