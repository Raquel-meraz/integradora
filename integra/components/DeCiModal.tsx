// components/DeCiModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Appointment } from "../hooks/useAppointments";

const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";
const DANGER = "#991b1b";

type Props = {
  visible: boolean;
  appt: Appointment | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
};

function fDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

export default function DeCiModal({ visible, appt, onClose, onComplete, onCancel }: Props) {
  const isDone = appt?.status === "completed";
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="calendar-check" size={18} color="#fff" />
            </View>
            <Text style={styles.title}>Detalle de la cita</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="car-hatchback" size={20} style={styles.rowIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{appt?.carName}</Text>
              <Text style={styles.rowMeta}>{appt?.year}    {appt?.plate}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="spray-bottle" size={20} style={styles.rowIcon} />
            <Text style={styles.rowTitle}>{appt?.service}</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="clock-outline" size={20} style={styles.rowIcon} />
            <Text style={styles.rowTitle}>{fDate(appt?.datetime)}</Text>
          </View>

          <View style={[styles.badge, isDone ? styles.badgeDone : styles.badgePend]}>
            <Text style={[styles.badgeText, isDone ? { color: "#065f46" } : { color: "#7c2d12" }]}>
              {isDone ? "Completado" : "Pendiente"}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              disabled={!appt}
              onPress={() => appt && onCancel(appt.id)}
              style={[styles.btnDanger, { marginRight: 8, opacity: appt ? 1 : 0.6 }]}
            >
              <Text style={styles.btnDangerText}>Cancelar</Text>
            </TouchableOpacity>

            {!isDone && (
              <TouchableOpacity
                disabled={!appt}
                onPress={() => appt && onComplete(appt.id)}
                style={[styles.btn, { marginLeft: 8, opacity: appt ? 1 : 0.6 }]}
              >
                <Text style={styles.btnText}>Completar</Text>
              </TouchableOpacity>
            )}

            {isDone && (
              <TouchableOpacity onPress={onClose} style={[styles.btnOutline, { marginLeft: 8 }]}>
                <Text style={styles.btnOutlineText}>Cerrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", alignItems: "center", justifyContent: "center", padding: 24 },
  sheet: { width: "100%", backgroundColor: CARD, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12, justifyContent: "center" },
  iconWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: ACCENT, alignItems: "center", justifyContent: "center", marginRight: 8 },
  title: { fontSize: 18, fontWeight: "800", color: TEXT },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: BORDER },
  rowIcon: { marginRight: 10, color: TEXT, opacity: 0.9 },
  rowTitle: { color: TEXT, fontWeight: "700" },
  rowMeta: { color: MUTED, marginTop: 2, fontSize: 13 },

  badge: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, marginTop: 12 },
  badgePend: { borderColor: "#fed7aa", backgroundColor: "#fffbeb" },
  badgeDone: { borderColor: "#a7f3d0", backgroundColor: "#ecfdf5" },
  badgeText: { fontSize: 12, fontWeight: "700" },

  actions: { flexDirection: "row", marginTop: 14, justifyContent: "flex-end" },
  btn: { backgroundColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center", paddingHorizontal: 16 },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: { borderWidth: 2, borderColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center", paddingHorizontal: 16 },
  btnOutlineText: { color: ACCENT, fontWeight: "700" },
  btnDanger: { backgroundColor: DANGER, paddingVertical: 12, borderRadius: 12, alignItems: "center", paddingHorizontal: 16 },
  btnDangerText: { color: "#fff", fontWeight: "700" },
});
