// components/ServiceModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type Service = { id: string; label: string; price: number; timeMin: number };

// Puedes editar precios/tiempos aquí
const SERVICES: Service[] = [
  { id: "ext", label: "Exterior", price: 120, timeMin: 30 },
  { id: "int", label: "Interior", price: 130, timeMin: 40 },
  { id: "full", label: "Completo", price: 200, timeMin: 70 },
];

// Solo necesitamos estos campos del auto
type CarLike = { name: string; year: string; plate: string };

type Props = {
  visible: boolean;
  car?: CarLike | null;                // 👈 nuevo
  onClose: () => void;
  onConfirm: (service: Service) => void;
};

const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";

export default function ServiceModal({ visible, car, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Agendar cita</Text>

          {/* Header con datos del auto */}
          {car && (
            <View style={styles.carCard}>
              <MaterialCommunityIcons name="car-hatchback" size={24} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.carTitle}>{car.name}</Text>
                <Text style={styles.carMeta}>{car.year}    {car.plate}</Text>
              </View>
            </View>
          )}

          <Text style={styles.subtitle}>Servicios</Text>

          {SERVICES.map((s) => {
            const active = selected?.id === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSelected(s)}
                style={[styles.row, active && styles.rowActive]}
              >
                <Text style={styles.left}>{s.label}</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.right}>${s.price}</Text>
                  <Text style={[styles.right, { color: MUTED }]}>{s.timeMin} min.</Text>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.btnOutline, { marginRight: 8 }]}>
              <Text style={styles.btnOutlineText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!selected}
              onPress={() => selected && onConfirm(selected)}
              style={[styles.btn, { marginLeft: 8, opacity: selected ? 1 : 0.6 }]}
            >
              <Text style={styles.btnText}>seleccionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", color: TEXT, marginBottom: 10 },

  // Header del auto
  carCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  carTitle: { fontWeight: "800", color: TEXT, letterSpacing: 0.3 },
  carMeta: { color: MUTED, marginTop: 2, fontSize: 13 },

  subtitle: { fontSize: 12, color: MUTED, marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  rowActive: { backgroundColor: "#f3f4f6" },
  left: { fontSize: 16, color: TEXT, fontWeight: "600" },
  right: { fontSize: 14, color: TEXT },

  actions: { flexDirection: "row", marginTop: 14 },
  btn: {
    flex: 1,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnOutlineText: { color: ACCENT, fontWeight: "700" },
});
