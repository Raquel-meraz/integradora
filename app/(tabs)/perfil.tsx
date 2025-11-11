// app/(tabs)/perfil.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";   // 👈 usa el contexto
import { router } from "expo-router";

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

export default function PerfilScreen() {
  const { user, logout } = useAuth(); // 👈 de aquí sale el usuario real

  const onCerrarSesion = async () => {
    try {
      await logout();               // 👈 esto sí limpia el contexto
      router.replace("/login");     // 👈 te manda al login
    } catch (e) {
      Alert.alert("Ups", "No se pudo cerrar sesión, inténtalo de nuevo.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.headerCard, SHADOW]}>
          <Ionicons name="person-circle-outline" size={88} color={TEXT} />
          <Text style={styles.name}>
            {user?.role === "admin" ? "Admin" : "Cliente"}
          </Text>
          <Text style={styles.email}>{user?.email ?? "sin-correo@example.com"}</Text>
        </View>

        <View style={styles.group}>
          <ListItem
            icon={<Ionicons name="id-card-outline" size={22} color={TEXT} />}
            title="Información personal"
          />
          <ListItem
            icon={<MaterialCommunityIcons name="lock-reset" size={22} color={TEXT} />}
            title="Cambiar contraseña"
          />
          <ListItem
            icon={<Ionicons name="notifications-outline" size={22} color={TEXT} />}
            title="Notificaciones"
            last
          />
        </View>

        <Pressable style={[styles.logoutBtn, SHADOW]} onPress={onCerrarSesion}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutTxt}>Cerrar sesión</Text>
        </Pressable>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ListItem({
  icon,
  title,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.item,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: BORDER,
        },
      ]}
    >
      <View style={styles.itemLeft}>
        {icon}
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={MUTED} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  name: { fontSize: 20, fontWeight: "700", color: TEXT },
  email: { fontSize: 13, color: MUTED, marginTop: 2 },
  group: {
    backgroundColor: CARD,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  item: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemTitle: { fontSize: 15, color: TEXT, fontWeight: "600" },
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
  },
  logoutTxt: { color: "#DC2626", fontWeight: "700" },
});
