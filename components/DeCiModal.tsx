// components/DeCiModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Appt = {
  id: string;
  service?: string;
  datetime: string;
  status?: "pending" | "completed";
  // Campos opcionales (con distintos nombres posibles)
  clientName?: string;
  name?: string;
  client?: { name?: string; phone?: string; email?: string };
  phone?: string;
  phoneNumber?: string;
  clientPhone?: string;
  tel?: string;
  cel?: string;
  email?: string;
  carName?: string;
  vehicle?: string;
  auto?: string;
  plate?: string;
  plates?: string;
  licensePlate?: string;
  placas?: string;
  matricula?: string;
  brand?: string;
  model?: string;
};

const pickStr = (...xs: any[]) =>
  xs.find((x) => typeof x === "string" && x.trim().length > 0) as
    | string
    | undefined;

function extractClient(a: Appt) {
  const name =
    pickStr(a.clientName, a.name, a.client?.name) || "Sin nombre";
  const phone = pickStr(
    a.phone,
    a.phoneNumber,
    a.clientPhone,
    a.client?.phone,
    a.tel,
    a.cel
  );
  const email = pickStr(a.email, a.client?.email);
  return { name, phone, email };
}

function extractVehicle(a: Appt) {
  const car =
    pickStr(
      a.carName,
      a.vehicle,
      a.auto,
      [a.brand, a.model].filter(Boolean).join(" ")
    ) || "Vehículo";
  const plate = pickStr(
    a.plate,
    a.plates,
    a.licensePlate,
    a.placas,
    a.matricula
  );
  return { car, plate: plate ? String(plate).toUpperCase() : undefined };
}

export default function DeCiModal({
  visible,
  appt,
  onClose,
  onComplete,
  onCancel,
}: {
  visible: boolean;
  appt: Appt | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  if (!visible || !appt) return null;

  const fmtTop = (iso: string) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} - ${time}`;
  };

  const { car, plate } = extractVehicle(appt);
  const { name, phone, email } = extractClient(appt);

  const handleComplete = () => onComplete(appt.id);
  const handleCancel = () => onCancel(appt.id);

  const callPhone = () => {
    if (!phone) return;
    const digits = phone.replace(/[^\d]/g, "");
    Linking.openURL(`tel:${digits}`);
  };
  const openWhatsApp = () => {
    if (!phone) return;
    const digits = phone.replace(/[^\d]/g, "");
    const msg = encodeURIComponent(
      `Hola ${name}, te contactamos sobre tu cita.`
    );
    Linking.openURL(`https://wa.me/${digits}?text=${msg}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <Pressable style={s.hitSlopFill} onPress={onClose} />
        <View style={s.card}>
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerTitle}>
              <Ionicons
                name="help-outline"
                size={18}
                color="#0f172a"
                style={{ marginRight: 4 }}
              />
              <Text style={s.title}>Detalle de la cita</Text>
            </View>
            <Pressable onPress={onClose} style={s.closeBtn} hitSlop={10}>
              <Ionicons name="close" size={22} color="#0f172a" />
            </Pressable>
          </View>

          {/* Vehículo */}
          <View style={[s.row, s.dividerBottom]}>
            <MaterialCommunityIcons name="car" size={18} color="#0f172a" />
            <Text style={s.rowTxt}>
              {car}
              {plate ? `  ·  ${plate}` : ""}
            </Text>
          </View>

          {/* 👇 NUEVO: Cliente / contacto */}
          <View style={[s.row, s.dividerBottom]}>
            <Ionicons name="person-outline" size={18} color="#0f172a" />
            <View style={{ flex: 1 }}>
              <Text style={s.rowTxt}>{name}</Text>
              {(phone || email) && (
                <Text style={[s.rowSub, { marginTop: 2 }]}>
                  {[phone, email].filter(Boolean).join("  ·  ")}
                </Text>
              )}
            </View>

            {phone ? (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable onPress={callPhone} hitSlop={8}>
                  <Ionicons name="call-outline" size={18} color="#16a34a" />
                </Pressable>
                <Pressable onPress={openWhatsApp} hitSlop={8}>
                  <Ionicons name="logo-whatsapp" size={18} color="#16a34a" />
                </Pressable>
              </View>
            ) : null}
          </View>

          {/* Servicio */}
          {appt.service ? (
            <View style={[s.row, s.dividerBottom]}>
              <MaterialCommunityIcons
                name="spray-bottle"
                size={18}
                color="#0f172a"
              />
              <Text style={s.rowTxt}>{appt.service}</Text>
            </View>
          ) : null}

          {/* Fecha/hora */}
          <View style={s.row}>
            <Ionicons name="time-outline" size={18} color="#0f172a" />
            <Text style={s.rowTxt}>{fmtTop(appt.datetime)}</Text>
          </View>

          {/* Estado */}
          <View style={{ marginTop: 8 }}>
            <View
              style={[
                s.badge,
                appt.status === "pending" ? s.badgePend : s.badgeDone,
              ]}
            >
              <Text
                style={
                  appt.status === "pending" ? s.badgeTxtPend : s.badgeTxtDone
                }
              >
                {appt.status === "completed" ? "Completada" : "Pendiente"}
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View style={s.actions}>
            <Pressable onPress={handleCancel} style={[s.btn, s.btnDanger]}>
              <Text style={s.btnTxt}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleComplete} style={[s.btn, s.btnPrimary]}>
              <Text style={s.btnTxt}>Completar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  hitSlopFill: { ...StyleSheet.absoluteFillObject },
  card: {
    width: "100%",
    maxWidth: 1100,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
      default: { elevation: 0 },
    }),
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  closeBtn: { position: "absolute", right: 0, padding: 4, borderRadius: 999 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10 },
  dividerBottom: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#e5e7eb" },
  rowTxt: { color: "#111827", fontSize: 15 },
  rowSub: { color: "#6b7280", fontSize: 13 },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgePend: { borderColor: "#fed7aa", backgroundColor: "#fffbeb" },
  badgeDone: { borderColor: "#bbf7d0", backgroundColor: "#ecfdf5" },
  badgeTxtPend: { color: "#7c2d12", fontWeight: "700" },
  badgeTxtDone: { color: "#065f46", fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 18 },
  btn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#0f172a" },
  btnDanger: { backgroundColor: "#b91c1c" },
  btnGhost: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb" },
  btnTxt: { color: "#fff", fontWeight: "800" },
});
