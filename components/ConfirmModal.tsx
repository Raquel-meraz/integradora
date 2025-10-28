import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type CarLike = { name?: string; year?: string; plate?: string };

type Props = {
  visible: boolean;
  car?: CarLike | null;
  service?: string | null;
  dateLabel?: string | null;
  hour?: string | null;
  onClose: () => void;       // Editar
  onConfirm: () => void;     // Confirmar
};

const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";

export default function ConfirmModal({
  visible,
  car,
  service,
  dateLabel,
  hour,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="check" size={18} color="#fff" />
            </View>
            <Text style={styles.title}>Confirmar cita</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="car-hatchback" size={20} style={styles.rowIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{car?.name ?? "Auto"}</Text>
              <Text style={styles.rowMeta}>{car?.year}    {car?.plate}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="spray-bottle" size={20} style={styles.rowIcon} />
            <Text style={styles.rowTitle}>{service ?? "-"}</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="calendar-month" size={20} style={styles.rowIcon} />
            <Text style={styles.rowTitle}>{dateLabel ?? "-"}</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="clock-outline" size={20} style={styles.rowIcon} />
            <Text style={styles.rowTitle}>{hour ?? "-"}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.btnOutline, { marginRight: 8 }]}>
              <Text style={styles.btnOutlineText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.btn, { marginLeft: 8 }]}>
              <Text style={styles.btnText}>Confirmar</Text>
            </TouchableOpacity>
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
  actions: { flexDirection: "row", marginTop: 14 },
  btn: { flex: 1, backgroundColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: { flex: 1, borderWidth: 2, borderColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnOutlineText: { color: ACCENT, fontWeight: "700" },
});
