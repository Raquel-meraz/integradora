// app/(auth)/register.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");

  const valid =
    name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    /^\+?[0-9\s-]{7,}$/.test(phone || "0000000") &&
    pwd.length >= 6;

  const onCreate = () => {
    if (!valid) return;
    // Lógica real de registro aquí
    Alert.alert("¡Cuenta creada!", "Ahora puedes iniciar sesión.");
    router.replace("/LogyReg/login");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre completo"
            placeholderTextColor="#9aa1aa"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@example.com"
            placeholderTextColor="#9aa1aa"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="618-123-4567"
            placeholderTextColor="#9aa1aa"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={pwd}
            onChangeText={setPwd}
            placeholder=".........."
            placeholderTextColor="#9aa1aa"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={onCreate}
          disabled={!valid}
          style={[styles.primaryBtn, { opacity: valid ? 1 : 0.6 }]}
        >
          <Text style={styles.primaryText}>Crear cuenta</Text>
        </Pressable>

        <Text style={styles.smallMuted}>¿Ya tienes una cuenta?</Text>
        <Pressable onPress={() => router.replace("/LogyReg/login")}>
          <Text style={styles.linkBold}>Iniciar sesión</Text>
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
    ...SHADOW, marginBottom: 12, paddingTop: 10
  },
  label: { color: MUTED, fontSize: 12, marginLeft: 14, marginBottom: 4 },
  input: { paddingHorizontal: 14, paddingVertical: 10, color: TEXT },

  primaryBtn: {
    width: "100%", backgroundColor: ACCENT, paddingVertical: 12, borderRadius: 12, alignItems: "center", marginTop: 8
  },
  primaryText: { color: "#fff", fontWeight: "700" },

  smallMuted: { color: MUTED, marginTop: 18, marginBottom: 4 },
  linkBold: { color: TEXT, fontWeight: "800", fontSize: 16, textDecorationLine: "underline" },
});
