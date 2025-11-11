// app/(tabs)/AdminHome.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, FlatList, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAppointments } from "../../hooks/useAppointments";
import DeCiModal from "../../components/DeCiModal";
import { styles, stylesP, TEXT, MUTED, BORDER } from "../styles/adminHomeStyles";
import { router } from "expo-router";


// === mapa de precios (ajústalo a tus servicios reales) ===
const SERVICE_PRICE: Record<string, number> = {
  "Lavado premium": 250,
  "Lavado express": 120,
  "Encerado profesional": 480,
};

const fmtMoney = (v: number) =>
  v.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const isToday = (iso: string) => {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

function fmtTop(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}
function fmtRow(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

const pickStr = (...xs: any[]) => xs.find((x) => typeof x === "string" && x.trim().length > 0) as string | undefined;

function extractApptFields(a: any) {
  const name = pickStr(a.clientName, a.name, a.client?.name) || "Sin nombre";
  const phone = pickStr(a.phone, a.phoneNumber, a.clientPhone, a.client?.phone, a.tel, a.cel);
  const car = pickStr(a.carName, [a.brand, a.model].filter(Boolean).join(" "), a.vehicle, a.auto) || "Vehículo";
  const plate = pickStr(a.plate, a.plates, a.licensePlate, a.placas, a.matricula);
  return { name, phone, car, plate };
}

export default function AdminHome() {
  const { appts, toggleDone, remove } = useAppointments();
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const now = Date.now();

  const { total, pending, completed, next, pendingSorted, selected, revenueToday } = useMemo(() => {
    const total = appts.length;
    const completed = appts.filter((a) => a.status === "completed").length;
    const pending = total - completed;

    const next =
      appts
        .filter((a) => a.status === "pending" && new Date(a.datetime).getTime() >= now)
        .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime))[0] ?? null;

    const pendingSorted = appts
      .filter((a) => a.status === "pending")
      .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime));

    const selected = appts.find((a) => a.id === selectedId) ?? null;

    const revenueToday = appts
      .filter((a) => a.status === "completed" && isToday(a.datetime))
      .reduce((sum, a) => sum + (SERVICE_PRICE[a.service] ?? 0), 0);

    return { total, pending, completed, next, pendingSorted, selected, revenueToday };
  }, [appts, now, selectedId]);

  const openFromCard = (id: string) => {
    setSelectedId(id);
    setOpenDetail(true);
  };

  const handleComplete = (id: string) => {
    toggleDone(id);
    setOpenDetail(false);
  };

  const handleCancel = (id: string) => {
    Alert.alert("Cancelar cita", "¿Seguro que deseas cancelar esta cita?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: () => {
          remove(id);
          setOpenDetail(false);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Buscar + Ganancias */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <View style={[styles.searchBar, { flex: 1, minWidth: 240 }]}>
          <Ionicons name="search" size={18} />
          <TextInput style={styles.searchInput} placeholder="Buscar" placeholderTextColor="#9aa1aa" />
        </View>

        <Pressable
          onPress={() => router.push("/ganancias")}
          style={{
            backgroundColor: "#eef2ff",
            borderColor: "#c7d2fe",
            borderWidth: 1,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 999,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "800", color: "#3730a3" }}>
            Ganancias hoy: <Text style={{ color: TEXT, fontWeight: "900" }}>{fmtMoney(revenueToday)}</Text> ›
          </Text>
        </Pressable>
      </View>

      {/* Próxima cita */}
      <Text style={styles.sectionTitle}>Próxima cita</Text>
      <Pressable
        disabled={!next}
        onPress={() => next && openFromCard(next.id)}
        style={[styles.card, !next && { opacity: 0.6 }]}
      >
        {next ? (
          <>
            <Text style={styles.cardTitle}>Próxima cita</Text>
            <Text style={styles.cardSubtitle}>{fmtTop(next.datetime)}</Text>
            {(() => {
              const { name, phone, car, plate } = extractApptFields(next);
              return (
                <>
                  <Text style={[styles.cardMinor, { marginTop: 6 }]}>
                    <Ionicons name="person-outline" size={14} /> {name}
                    {phone ? ` · ${phone}` : ""}
                  </Text>
                  <Text style={styles.cardMinor}>
                    <MaterialCommunityIcons name="car-hatchback" size={14} /> {car}
                    {plate ? ` · ${String(plate).toUpperCase()}` : ""}
                  </Text>
                </>
              );
            })()}
            <View style={styles.chip}>
              <Text style={styles.chipText}>{next.service}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.cardMinor}>No hay citas próximas.</Text>
        )}
      </Pressable>

      {/* KPIs */}
      <View style={styles.statsRow}>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>citas</Text>
        </View>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{pending}</Text>
          <Text style={styles.statLabel}>proceso</Text>
        </View>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{completed}</Text>
          <Text style={styles.statLabel}>Completo</Text>
        </View>
      </View>

      {/* Citas pendientes */}
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Citas pendientes</Text>
      <FlatList
        data={pendingSorted}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const { name, phone, car, plate } = extractApptFields(item);
          return (
            <Pressable
              onPress={() => openFromCard(item.id)}
              style={[styles.card, { flexDirection: "row", alignItems: "center", gap: 12 }]}
            >
              <MaterialCommunityIcons name="car-hatchback" size={26} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitleSmall}>{item.service}</Text>
                <Text style={styles.cardMinor}>
                  <Ionicons name="person-outline" size={12} /> {name}
                  {phone ? ` · ${phone}` : ""}
                </Text>
                <Text style={styles.cardMinor}>
                  <MaterialCommunityIcons name="steering" size={12} /> {car}
                  {plate ? ` · ${String(plate).toUpperCase()}` : ""} — {fmtRow(item.datetime)}
                </Text>
              </View>
              <View style={[styles.badge, styles.badgePend]}>
                <Text style={[styles.badgeText, { color: "#7c2d12" }]}>Pendiente</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: "center" }]}>
            <Text style={styles.cardMinor}>No hay citas pendientes.</Text>
          </View>
        }
      />

      <DeCiModal
        visible={openDetail}
        appt={selected}
        onClose={() => setOpenDetail(false)}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}
