// app/(auth)/login.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

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

export default function Login() {
  const { login } = useAuth();   // 👈 usamos el contexto
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email) && pwd.length >= 5;

  const onLogin = async () => {
    if (!valid || loading) return;
    setLoading(true);
    const res = await login(email, pwd);   // 👈 aquí
    setLoading(false);

    if (!res.ok || !res.user) {
      Alert.alert("Credenciales inválidas", res.error ?? "Revisa tus datos.");
      return;
    }

    // ya sabemos el rol porque viene del contexto
    if (res.user.role === "admin") {
      router.replace("/(admin)");
    } else {
      router.replace("/(tabs)");
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

        <Pressable
          onPress={onLogin}
          disabled={!valid || loading}
          style={[styles.primaryBtn, { opacity: valid && !loading ? 1 : 0.6 }]}
        >
          <Text style={styles.primaryText}>{loading ? "Entrando..." : "Iniciar sesión"}</Text>
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
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW,
    marginBottom: 12,
    position: "relative",
  },
  input: { paddingHorizontal: 14, paddingVertical: 12, color: TEXT },
  eyeBtn: { position: "absolute", right: 12, top: 12 },
  primaryBtn: {
    width: "100%",
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
});
