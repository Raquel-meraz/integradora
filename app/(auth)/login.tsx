import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const BG = "#f9fafb";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";
const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

// Cuentas mock
const ACCOUNTS: Record<string, { password: string; role: "admin" | "client" }> = {
  "admin@gmail.com": { password: "12345", role: "admin" },
  "cliente@gmail.com": { password: "67890", role: "client" },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email) && pwd.length >= 5;

  const onLogin = async () => {
    if (!valid || loading) return;
    try {
      setLoading(true);

      const key = email.trim().toLowerCase();
      const found = ACCOUNTS[key];
      if (!found || found.password !== pwd) {
        Alert.alert("Credenciales inválidas", "Revisa tu correo o contraseña.");
        return;
      }

      await AsyncStorage.setItem(
        "session",
        JSON.stringify({ email: key, role: found.role })
      );

      // Admin -> "/", Cliente -> "/cliente"
      router.replace(found.role === "admin" ? "/" : "/cliente");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Ocurrió un problema al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <View style={styles.inputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            placeholderTextColor="#9aa1aa"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            value={pwd}
            onChangeText={setPwd}
            placeholder="Contraseña"
            placeholderTextColor="#9aa1aa"
            secureTextEntry={!showPwd}
            style={[styles.input, { paddingRight: 40 }]}
          />
          <Pressable style={styles.eyeBtn} onPress={() => setShowPwd((s) => !s)}>
            <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={20} color={MUTED} />
          </Pressable>
        </View>

        <Pressable onPress={() => Alert.alert("Recuperar", "Implementa aquí tu flujo de recuperar contraseña.")}>
          <Text style={styles.linkMuted}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        <Pressable
          onPress={onLogin}
          disabled={!valid || loading}
          style={[styles.primaryBtn, { opacity: valid && !loading ? 1 : 0.6 }]}
        >
          <Text style={styles.primaryText}>{loading ? "Entrando..." : "Iniciar sesión"}</Text>
        </Pressable>

        <Pressable
          style={styles.googleBtn}
          onPress={() => Alert.alert("Google", "Conecta tu flujo de Google OAuth aquí.")}
        >
          <Ionicons name="arrow-forward-outline" size={18} color={TEXT} />
          <Text style={styles.googleText}>Continuar con Google</Text>
        </Pressable>

        <View style={{ height: 14 }} />

        <Text style={styles.smallMuted}>¿No tienes una cuenta?</Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.linkBold}>Regístrate</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, padding: 16 },
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "800", color: TEXT, marginBottom: 18 },
  inputWrap: {
    width: "100%", backgroundColor: CARD, borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    ...SHADOW, marginBottom: 12, position: "relative"
  },
  input: { paddingHorizontal: 14, paddingVertical: 12, color: TEXT },
  eyeBtn: { position: "absolute", right: 12, top: 12 },
  linkMuted: { color: MUTED, marginTop: 4, marginBottom: 12 },
  primaryBtn: {
    width: "100%", backgroundColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center", marginBottom: 12
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  googleBtn: {
    width: "100%", backgroundColor: CARD, borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    paddingVertical: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, ...SHADOW
  },
  googleText: { color: TEXT, fontWeight: "600" },
  smallMuted: { color: MUTED, marginTop: 18, marginBottom: 4 },
  linkBold: { color: TEXT, fontWeight: "800", fontSize: 16, textDecorationLine: "underline" },
});
