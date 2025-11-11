// app/(tabs)/citas.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, FlatList } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAppointments } from "../../hooks/useAppointments";
import { styles } from "./styles/citasStyles";

function fmtDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const label = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dayLabel: isToday ? "HOY" : label, time };
}

export default function Citas() {
  const { appts, toggleDone, remove } = useAppointments();
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  const now = Date.now();

  // 👉 "En proceso" = citas futuras cuyo status sea pending / in_process
  const filtered = useMemo(() => {
    return appts
      .slice()
      .sort((a, b) => +new Date(b.datetime) - +new Date(a.datetime))
      .filter((a) => {
        const isFuture = new Date(a.datetime).getTime() >= now;

        if (tab === "upcoming") {
          return (
            isFuture &&
            (a.status === "in_process" || a.status === "pending")
          );
        }

        // historial
        return (
          a.status === "completed" ||
          new Date(a.datetime).getTime() < now
        );
      });
  }, [appts, tab, now]);

  // Agrupar por día
  const groups = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    filtered.forEach((a) => {
      const { dayLabel } = fmtDateLabel(a.datetime);
      if (!g[dayLabel]) g[dayLabel] = [];
      g[dayLabel].push(a);
    });
    return Object.entries(g);
  }, [filtered]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Citas</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab("upcoming")}
          style={[styles.tabBtn, tab === "upcoming" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              tab === "upcoming" && styles.tabTextActive,
            ]}
          >
            En proceso
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("history")}
          style={[styles.tabBtn, tab === "history" && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              tab === "history" && styles.tabTextActive,
            ]}
          >
            Historial
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={([label]) => label}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item: [label, items] }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.groupHeader}>{label}</Text>

            {items.map((a) => {
              const { time } = fmtDateLabel(a.datetime);
              const isDone = a.status === "completed";
              const isHistory = tab === "history";

              return (
                <View key={a.id} style={styles.card}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="car-hatchback"
                      size={26}
                      style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.carTitle}>{a.carName}</Text>
                      <Text style={styles.meta}>
                        {a.service} · {time}
                      </Text>
                    </View>

                    {/* Estado */}
                    <View
                      style={[
                        styles.badge,
                        isDone ? styles.badgeDone : styles.badgePend,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isDone ? { color: "#065f46" } : { color: "#7c2d12" },
                        ]}
                      >
                        {isDone ? "Completado" : "En proceso"}
                      </Text>
                    </View>
                  </View>

                  {/* solo botón eliminar cuando es "En proceso" */}
                  {!isHistory && (
                    <View style={styles.actionsRow}>
                      <Pressable
                        hitSlop={8}
                        onPress={() => remove(a.id)}
                        style={[styles.smallBtn, { marginLeft: 8 }]}
                      >
                        <Feather name="trash-2" size={16} />
                        <Text style={styles.smallBtnText}>Eliminar</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
