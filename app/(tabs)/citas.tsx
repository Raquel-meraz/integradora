import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAppointments } from "../../hooks/useAppointments";

const BG = "#f3f4f6";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";
const SHADOW = { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 };

function fmtDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const label = d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return { dayLabel: isToday ? "HOY" : label, time };
}

export default function Citas() {
  const { appts, toggleDone, remove } = useAppointments();
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  const now = Date.now();
  const filtered = useMemo(() => {
    return appts
      .slice()
      .sort((a, b) => +new Date(b.datetime) - +new Date(a.datetime))
      .filter(a => tab === "upcoming"
        ? (new Date(a.datetime).getTime() >= now && a.status === "pending")
        : (new Date(a.datetime).getTime() < now || a.status === "completed")
      );
  }, [appts, tab, now]);

  // Agrupar por día
  const groups = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    filtered.forEach(a => {
      const { dayLabel } = fmtDateLabel(a.datetime);
      if (!g[dayLabel]) g[dayLabel] = [];
      g[dayLabel].push(a);
    });
    return Object.entries(g); // [ [label, items], ... ]
  }, [filtered]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Citas</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable onPress={() => setTab("upcoming")} style={[styles.tabBtn, tab === "upcoming" ? styles.tabActive : undefined]}>
          <Text style={[styles.tabText, tab === "upcoming" ? styles.tabTextActive : undefined]}>Próxima</Text>
        </Pressable>
        <Pressable onPress={() => setTab("history")} style={[styles.tabBtn, tab === "history" ? styles.tabActive : undefined]}>
          <Text style={[styles.tabText, tab === "history" ? styles.tabTextActive : undefined]}>Historial</Text>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={([label]) => label}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item: [label, items] }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.groupHeader}>{label}</Text>

            {items.map(a => {
              const { time } = fmtDateLabel(a.datetime);
              const isDone = a.status === "completed";
              return (
                <View key={a.id} style={styles.card}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="car-hatchback" size={26} style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.carTitle}>{a.carName}</Text>
                      <Text style={styles.meta}>{a.service} · {time}</Text>
                    </View>

                    {/* Estado */}
                    <View style={[styles.badge, isDone ? styles.badgeDone : styles.badgePend]}>
                      <Text style={[styles.badgeText, isDone ? { color: "#065f46" } : { color: "#7c2d12" }]}>
                        {isDone ? "Completado" : "Pendiente"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <Pressable hitSlop={8} onPress={() => toggleDone(a.id)} style={[styles.smallBtn]}>
                      <Feather name={isDone ? "rotate-ccw" : "check"} size={16} />
                      <Text style={styles.smallBtnText}>{isDone ? "Reabrir" : "Marcar done"}</Text>
                    </Pressable>
                    <Pressable hitSlop={8} onPress={() => remove(a.id)} style={[styles.smallBtn, { marginLeft: 8 }]}>
                      <Feather name="trash-2" size={16} />
                      <Text style={styles.smallBtnText}>Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, padding: 16 },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", marginVertical: 6, color: TEXT },

  tabs: { flexDirection: "row", justifyContent: "center", marginBottom: 8 },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: BORDER, backgroundColor: "#fff", marginHorizontal: 4 },
  tabActive: { backgroundColor: "#111827" },
  tabText: { color: TEXT, fontWeight: "700", fontSize: 12 },
  tabTextActive: { color: "#fff" },

  groupHeader: { color: MUTED, fontWeight: "700", marginBottom: 6, marginTop: 6, textTransform: "uppercase", fontSize: 12 },

  card: { backgroundColor: CARD, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: BORDER, ...SHADOW, marginBottom: 10 },
  carTitle: { fontWeight: "800", letterSpacing: 0.3, color: TEXT },
  meta: { color: MUTED, marginTop: 2 },

  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  badgePend: { borderColor: "#fed7aa", backgroundColor: "#fffbeb" },
  badgeDone: { borderColor: "#a7f3d0", backgroundColor: "#ecfdf5" },
  badgeText: { fontSize: 12, fontWeight: "700" },

  actionsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  smallBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: BORDER, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  smallBtnText: { marginLeft: 6, fontSize: 12, color: TEXT, fontWeight: "700" },
});
