// app/index.tsx (ADMIN con detalle de cita)
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAppointments } from "../../hooks/useAppointments";
import DeCiModal from "../../components/DeCiModal"; // ✅ nombre correcto

const BG = "#f3f4f6";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
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

export default function AdminHome() {
  const { appts, toggleDone, remove } = useAppointments();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const now = Date.now();

  const { total, pending, completed, next, pendingSorted, selected } = useMemo(() => {
    const total = appts.length;
    const completed = appts.filter(a => a.status === "completed").length;
    const pending = total - completed;

    const next =
      appts
        .filter(a => a.status === "pending" && new Date(a.datetime).getTime() >= now)
        .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime))[0] ?? null;

    const pendingSorted = appts
      .filter(a => a.status === "pending")
      .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime));

    const selected = appts.find(a => a.id === selectedId) ?? null;

    return { total, pending, completed, next, pendingSorted, selected };
  }, [appts, now, selectedId]);

  const openFromCard = (id: string) => { setSelectedId(id); setOpenDetail(true); };

  const handleComplete = (id: string) => {
    toggleDone(id);                   // pasa a "completed"
    setOpenDetail(false);
  };

  const handleCancel = (id: string) => {
    Alert.alert("Cancelar cita", "¿Seguro que deseas cancelar esta cita?", [
      { text: "No", style: "cancel" },
      { text: "Sí, cancelar", style: "destructive", onPress: () => { remove(id); setOpenDetail(false); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Buscar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} />
        <TextInput style={styles.searchInput} placeholder="Buscar" placeholderTextColor="#9aa1aa" />
      </View>

      {/* Próxima cita (pendiente + futura) */}
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
            <View style={styles.chip}><Text style={styles.chipText}>{next.service}</Text></View>
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

      {/* Solo citas PENDIENTES (admin) */}
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Citas pendientes</Text>
      <FlatList
        data={pendingSorted}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => openFromCard(item.id)} style={[styles.card, { flexDirection: "row", alignItems: "center", gap: 12 }]}>
            <MaterialCommunityIcons name="car-hatchback" size={26} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitleSmall}>{item.service}</Text>
              <Text style={styles.cardMinor}>
                {item.carName}{item.plate ? ` · ${((String(item.plate).match(/\d/g) || []).join('').slice(0,4))}` : ""} — {fmtRow(item.datetime)}
              </Text>
            </View>
            <View style={[styles.badge, styles.badgePend]}>
              <Text style={[styles.badgeText, { color: "#7c2d12" }]}>Pendiente</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: "center" }]}>
            <Text style={styles.cardMinor}>No hay citas pendientes.</Text>
          </View>
        }
      />

      {/* Modal de detalle con acciones */}
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 8 },

  searchBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: CARD,
    borderRadius: 12, paddingHorizontal: 10, height: 40, borderWidth: 1, borderColor: BORDER,
    ...SHADOW, marginBottom: 12
  },
  searchInput: { marginLeft: 8, flex: 1 },

  sectionTitle: { color: MUTED, fontSize: 14, marginBottom: 8 },

  card: {
    backgroundColor: CARD, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: BORDER, ...SHADOW, marginBottom: 16
  },
  chip: { backgroundColor: "#e5e7eb", borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10, alignSelf: "flex-start", marginTop: 8 },
  chipText: { color: "#374151", fontSize: 12 },

  cardTitle: { fontSize: 16, fontWeight: "700", color: TEXT },
  cardTitleSmall: { fontSize: 15, fontWeight: "700", color: TEXT },
  cardSubtitle: { color: TEXT, opacity: 0.9, marginTop: 2 },
  cardMinor: { color: MUTED, marginTop: 2, fontSize: 13 },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  statCard: { flex: 1, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: TEXT },
  statLabel: { color: MUTED, marginTop: 4 },

  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  badgePend: { borderColor: "#fed7aa", backgroundColor: "#fffbeb" },
  badgeText: { fontSize: 12, fontWeight: "700" },
});

// --- Perfil: acciones inferiores (Información personal, Cambiar contraseña, Notificaciones + Cerrar sesión)

function PerfilActions() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Perfil</Text>

      <View style={[stylesP.group]}>
        <ActionItem
          icon={<Ionicons name="id-card-outline" size={22} color={TEXT} />}
          title="Información personal"
          onPress={() => Alert.alert("Información personal", "Aquí abrirías el detalle.")}
        />
        <ActionItem
          icon={<MaterialCommunityIcons name="lock-reset" size={22} color={TEXT} />}
          title="Cambiar contraseña"
          onPress={() => Alert.alert("Cambiar contraseña", "Aquí iría tu flujo de cambio.")}
        />
        <ActionItem
          icon={<Ionicons name="notifications-outline" size={22} color={TEXT} />}
          title="Notificaciones"
          onPress={() => Alert.alert("Notificaciones", "Configura tus notificaciones aquí.")}
          last
        />
      </View>

      <Pressable style={[stylesP.logoutBtn]} onPress={() => Alert.alert("Cerrar sesión", "Implementa tu lógica aquí.")}>
        <Ionicons name="log-out-outline" size={18} color="#DC2626" />
        <Text style={stylesP.logoutTxt}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

function ActionItem({
  icon,
  title,
  onPress,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        stylesP.item,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
      ]}
    >
      <View style={stylesP.itemLeft}>
        {icon}
        <Text style={stylesP.itemTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={MUTED} />
    </Pressable>
  );
}

const stylesP = StyleSheet.create({
  group: {
    backgroundColor: CARD,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    // sombra igual que tus cards
    ...SHADOW,
  },
  item: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemTitle: {
    fontSize: 15,
    color: TEXT,
    fontWeight: "600",
  },
  logoutBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOW,
  },
  logoutTxt: {
    color: "#DC2626",
    fontWeight: "700",
  },
});