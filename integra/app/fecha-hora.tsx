// app/fecha-hora.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfirmModal from "../components/ConfirmModal";
import { useAppointments } from "../hooks/useAppointments"; // 👈 nuevo

const BG = "#f3f4f6";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";

const HOURS = ["13:00","14:00","15:00","16:00","17:00","18:00"];

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
function buildMonthGrid(d: Date): (number | null)[] {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7; // lunes=0
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function FechaHora() {
  const router = useRouter();
  const { add } = useAppointments();           // 👈 para guardar la cita
  const { car, year, plate, service } = useLocalSearchParams<{car?: string; year?: string; plate?: string; service?: string;}>();

  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const grid = useMemo(() => buildMonthGrid(month), [month]);
  const dateLabel =
    selectedDay != null
      ? new Date(month.getFullYear(), month.getMonth(), selectedDay).toLocaleDateString(undefined, {
          day: "2-digit", month: "short", year: "numeric",
        })
      : null;

  const nextMonth = () => setMonth(m => new Date(m.getFullYear(), m.getMonth()+1, 1));
  const prevMonth = () => setMonth(m => new Date(m.getFullYear(), m.getMonth()-1, 1));

  const openConfirm = () => {
    if (!selectedDay || !selectedHour) return; // podrías mostrar un toast
    setConfirmOpen(true);
  };

  // 👉 Ahora confirmamos guardando en el store y navegando a /citas
  const doConfirm = () => {
    if (!selectedDay || !selectedHour) return;
    const [hh, mm] = selectedHour.split(":").map(Number);
    const dt = new Date(
      month.getFullYear(),
      month.getMonth(),
      selectedDay,
      hh,
      mm,
      0,
      0
    );

    add({
      id: String(Date.now()),
      carName: String(car ?? "Auto"),
      year: String(year ?? ""),
      plate: String(plate ?? ""),
      service: String(service ?? ""),
      datetime: dt.toISOString(),
      status: "pending",
    });

    setConfirmOpen(false);
    router.replace("../citas");
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Auto */}
      <View style={styles.carCard}>
        <MaterialCommunityIcons name="car-hatchback" size={24} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.carTitle}>{car ?? "Auto"}</Text>
          <Text style={styles.carMeta}>{year}    {plate}</Text>
          {service ? <Text style={[styles.carMeta, { marginTop: 4 }]}>Servicio: {service}</Text> : undefined}
        </View>
      </View>

      <Text style={styles.title}>Fecha y hora</Text>

      {/* Cabecera del mes */}
      <View style={styles.monthHeader}>
        <Pressable onPress={prevMonth} style={styles.navBtn}><Text style={styles.navText}>‹</Text></Pressable>
        <Text style={styles.monthText}>{monthLabel(month)}</Text>
        <Pressable onPress={nextMonth} style={styles.navBtn}><Text style={styles.navText}>›</Text></Pressable>
      </View>

      {/* Días semana */}
      <View style={styles.weekRow}>
        {["L","M","X","J","V","S","D"].map(d => <Text key={d} style={styles.weekCell}>{d}</Text>)}
      </View>

      {/* Calendario */}
      <View style={styles.grid}>
        {grid.map((cell, idx) => {
          const active = !!cell && cell === selectedDay;
          return (
            <Pressable
              key={idx}
              onPress={() => cell && setSelectedDay(cell)}
              style={[
                styles.cell,
                active ? styles.cellActive : undefined,
                cell ? undefined : { backgroundColor: "transparent", borderColor: "transparent" },
              ]}
              disabled={!cell}
            >
              {cell !== null ? (
                <Text style={[styles.cellText, active ? { color: "#fff" } : undefined]}>
                  {cell}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* Horas */}
      <Text style={[styles.subtitle, { marginTop: 10 }]}>Horas disponibles</Text>
      <View style={styles.hoursRow}>
        {HOURS.map(h => {
          const active = h === selectedHour;
          return (
            <Pressable
              key={h}
              onPress={() => setSelectedHour(h)}
              style={[styles.hourChip, active ? styles.hourChipActive : undefined]}
            >
              <Text style={[styles.hourText, active ? { color: "#fff" } : undefined]}>{h}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Pressable onPress={() => router.back()} style={[styles.btnOutline, { marginRight: 8 }]} >
          <Text style={styles.btnOutlineText}>Atrás</Text>
        </Pressable>
        <Pressable onPress={openConfirm} style={[styles.btn, { marginLeft: 8 }]}>
          <Text style={styles.btnText}>Siguiente</Text>
        </Pressable>
      </View>

      {/* Modal Confirmación */}
      <ConfirmModal
        visible={confirmOpen}
        car={{ name: car, year, plate }}
        service={service ?? null}
        dateLabel={dateLabel}
        hour={selectedHour}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, padding: 16 },

  // Auto
  carCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: CARD,
    borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 12, marginBottom: 10
  },
  carTitle: { fontWeight: "800", color: TEXT, letterSpacing: 0.3 },
  carMeta: { color: MUTED, marginTop: 2, fontSize: 13 },

  title: { fontSize: 20, fontWeight: "800", textAlign: "center", marginVertical: 6, color: TEXT },

  monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 6 },
  monthText: { fontSize: 16, fontWeight: "700", color: TEXT, textTransform: "capitalize" },
  navBtn: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, borderColor: BORDER, alignItems: "center", justifyContent: "center", backgroundColor: CARD },
  navText: { fontSize: 18, color: TEXT },

  weekRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4, marginTop: 6 },
  weekCell: { width: 40, textAlign: "center", color: MUTED },

  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  cell: { width: 40, height: 40, margin: 4, borderRadius: 8, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, alignItems: "center", justifyContent: "center" },
  cellActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  cellText: { color: TEXT },

  subtitle: { color: MUTED, fontSize: 12 },
  hoursRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  hourChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: BORDER, backgroundColor: CARD, margin: 4 },
  hourChipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  hourText: { color: TEXT, fontWeight: "600" },

  actions: { flexDirection: "row", marginTop: 14 },
  btn: { flex: 1, backgroundColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: { flex: 1, borderWidth: 2, borderColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnOutlineText: { color: ACCENT, fontWeight: "700" },
});
