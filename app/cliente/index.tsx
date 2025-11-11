// app/cliente/index.tsx  (CLIENTE)

import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppointments } from "../../hooks/useAppointments";
import { PlanesSection } from "./planes"; // ✅ import de la sección reutilizable

// Paleta y sombras (tu estilo)
const BG = "#f3f4f6";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";
const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  const f1 = d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const f2 = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${f1} · ${f2}`;
}

export default function ClienteHome() {
  const { appts } = useAppointments();

  const [userName, setUserName] = useState<string>("Usuario");
  const phone: string | null = null; // cuando conectes BD, pon aquí el teléfono real

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("session");
      if (raw) {
        try {
          const s = JSON.parse(raw);
          const n = (s?.email || "").split("@")[0] || "Usuario";
          setUserName(n.charAt(0).toUpperCase() + n.slice(1));
        } catch {}
      }
    })();
  }, []);

  const now = Date.now();
  const { nextAppt, vehiclesCount, apptCount } = useMemo(() => {
    const nextAppt =
      appts
        .filter(a => a.status !== "completed" && +new Date(a.datetime) >= now)
        .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime))[0] ?? null;

    const vehicles = new Set(
      appts
        .map(a => (a.plate || a.carName || "").trim())
        .filter(Boolean)
    ).size;

    return { nextAppt, vehiclesCount: vehicles, apptCount: appts.length };
  }, [appts, now]);

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Avatar + Bienvenida */}
        <View style={s.header}>
          <Ionicons name="person-circle-outline" size={78} color={TEXT} />
          <Text style={s.hi}>¡Bienvenido!</Text>
          <Text style={s.name}>{userName}</Text>
        </View>

        {/* Métricas del cliente */}
        <View style={[s.card, { padding: 0 }]}>
          <View style={s.pillRow}>
            <InfoPill
              icon={<Ionicons name="call-outline" size={18} color={TEXT} />}
              top={phone || "—"}
              bottom="Contacto"
            />
            <Separator />
            <InfoPill
              icon={<MaterialCommunityIcons name="car-hatchback" size={18} color={TEXT} />}
              top={String(vehiclesCount || 0)}
              bottom="Vehículos"
            />
            <Separator />
            <InfoPill
              icon={<Ionicons name="calendar-outline" size={18} color={TEXT} />}
              top={String(apptCount || 0)}
              bottom="Citas"
            />
          </View>
        </View>

        {/* Próxima cita o vacío */}
        {nextAppt ? (
          <View style={s.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="calendar-outline" size={20} color={TEXT} />
              <Text style={s.cardTitle}>Tu próxima cita</Text>
            </View>

            <View style={{ marginTop: 10, gap: 8 }}>
              <Row
                icon={<MaterialCommunityIcons name="car-info" size={18} color={TEXT} />}
                label={`${nextAppt.carName || "Vehículo"}${
                  nextAppt.plate ? ` · ${nextAppt.plate}` : ""
                }`}
              />
              <Row
                icon={<Ionicons name="time-outline" size={18} color={TEXT} />}
                label={fmtDate(nextAppt.datetime)}
              />
              <View style={s.badge}>
                <Text style={s.badgeTxt}>{nextAppt.service}</Text>
              </View>
            </View>

            <View style={{ height: 8 }} />
            <Pressable style={s.primaryGhost} onPress={() => router.push("/citas")}>
              <Text style={s.primaryGhostTxt}>Ver mis citas</Text>
              <Ionicons name="chevron-forward" size={16} color={ACCENT} />
            </Pressable>
          </View>
        ) : (
          <View style={[s.empty, s.card]}>
            <Ionicons name="calendar-clear-outline" size={46} color={MUTED} />
            <Text style={s.emptyTitle}>No tienes citas programadas</Text>
            <Text style={s.emptyText}>
              Agenda tu primer servicio y dale a tu vehículo el cuidado que merece.
            </Text>

            <Pressable style={s.primaryBtn} onPress={() => router.push("/agendar")}>
              <Text style={s.primaryTxt}>Agendar cita</Text>
            </Pressable>
          </View>
        )}

        {/* ======== Sección: Planes de lavado (abajo) ======== */}
        <PlanesSection onSelect={() => router.push("/agendar")} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- UI helpers ---------- */

function InfoPill({
  icon,
  top,
  bottom,
}: {
  icon: React.ReactNode;
  top: string;
  bottom: string;
}) {
  return (
    <View style={s.pill}>
      {icon}
      <Text style={s.pillTop} numberOfLines={1}>
        {top}
      </Text>
      <Text style={s.pillBottom}>{bottom}</Text>
    </View>
  );
}

function Separator() {
  return <View style={{ width: 1, backgroundColor: BORDER, height: "70%" }} />;
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      {icon}
      <Text style={{ color: TEXT }}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 6 },

  header: { alignItems: "center", marginBottom: 10 },
  hi: { color: TEXT, fontSize: 22, fontWeight: "800", marginTop: 6 },
  name: { color: MUTED, marginTop: 2 },

  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginTop: 14,
    ...SHADOW,
  },

  // Pill row
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    gap: 2,
  },
  pillTop: { color: TEXT, fontWeight: "800" },
  pillBottom: { color: MUTED, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 },

  // Titles
  cardTitle: { color: TEXT, fontWeight: "800" },

  // Empty state
  empty: { alignItems: "center" },
  emptyTitle: { color: TEXT, fontSize: 18, fontWeight: "800", marginTop: 8, textAlign: "center" },
  emptyText: { color: MUTED, marginTop: 6, textAlign: "center" },

  // Badge
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  badgeTxt: { color: "#3730a3", fontSize: 12, fontWeight: "700" },

  // Buttons
  primaryBtn: {
    marginTop: 14,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "800" },

  primaryGhost: {
    marginTop: 10,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
  },
  primaryGhostTxt: { color: ACCENT, fontWeight: "800" },
});
