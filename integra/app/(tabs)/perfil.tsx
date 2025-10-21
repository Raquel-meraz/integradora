// app/(tabs)/perfil.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Colores y sombras iguales a tu index.tsx (según tu captura)
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

// Si tienes un hook useAuth, puedes traer user de ahí.
// Aquí saco email de AsyncStorage como fallback rápido.
async function getSessionEmail() {
  try {
    const raw = await AsyncStorage.getItem("session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.email ?? null;
  } catch {
    return null;
  }
}

export default function PerfilScreen() {
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const e = await getSessionEmail();
      setEmail(e);
    })();
  }, []);

  const onCerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("session");
      router.replace("/(auth)/login"); // ajusta si tu ruta de login es distinta
    } catch (e) {
      Alert.alert("Ups", "No se pudo cerrar sesión, inténtalo de nuevo.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Perfil */}
        <View style={[styles.headerCard, SHADOW]}>
          <View style={styles.avatarWrap}>
            {/* Si tienes una imagen local ponla aquí */}
            {/* <Image source={require("../../assets/profile.png")} style={styles.avatar} /> */}
            <Ionicons name="person-circle-outline" size={88} color={TEXT} />
          </View>

          <Text style={styles.name}>Ejem Perez</Text>
          <Text style={styles.email}>{email ?? "ejem_perez@example.com"}</Text>
        </View>

        {/* Acciones (parte de abajo del perfil) */}
        <View style={styles.group}>
          <ListItem
            icon={<Ionicons name="id-card-outline" size={22} color={TEXT} />}
            title="Información personal"
            onPress={() => Alert.alert("Información personal", "Aquí abrirías el detalle.")}
          />
          <ListItem
            icon={<MaterialCommunityIcons name="lock-reset" size={22} color={TEXT} />}
            title="Cambiar contraseña"
            onPress={() => Alert.alert("Cambiar contraseña", "Aquí iría tu flujo de cambio.")}
          />
          <ListItem
            icon={<Ionicons name="notifications-outline" size={22} color={TEXT} />}
            title="Notificaciones"
            onPress={() => Alert.alert("Notificaciones", "Configura tus notificaciones aquí.")}
            last
          />
        </View>

        {/* Cerrar sesión */}
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
        styles.item,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
      ]}
    >
      <View style={styles.itemLeft}>
        {icon}
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={MUTED} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
  },
  email: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
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
  },
  logoutTxt: {
    color: "#DC2626",
    fontWeight: "700",
  },
});
