import React, { useEffect, useState } from "react"; 
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";

export type Car = { id: string; name: string; year: string; plate: string; selected: boolean };

const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
};

export default function AddCarModal({ visible, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");   // <- guarda SOLO el sufijo (4 alfanuméricos)
  const [raw, setRaw] = useState("");       // <- lo que escribe el usuario (letras/números/guión)

  useEffect(() => {
    if (visible) { setName(""); setYear(""); setPlate(""); setRaw(""); }
  }, [visible]);

  // ✅ Válido: nombre >=3, año 4 dígitos, placas = 4 alfanuméricos
  const valid =
    name.trim().length >= 3 &&
    /^\d{4}$/.test(year.trim()) &&
    /^[A-Z0-9]{4}$/.test(plate.trim());

  const handleSave = () => {
    if (!valid) {
      Alert.alert("Faltan datos", "Revisa marca/modelo, año (4 dígitos) y placas (4 últimas letras/números).");
      return;
    }
    onSave({
      id: String(Date.now()),
      name: name.trim().toUpperCase(),
      year: year.trim(),
      plate: plate.trim().toUpperCase(), // ej. "099D"
      selected: false,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ width: "100%" }}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Nuevo auto</Text>

            <View style={styles.group}>
              <Text style={styles.label}>Marca / Modelo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ej. NISSAN VERSA"
                placeholderTextColor="#9aa1aa"
                style={styles.input}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={[styles.group, { flex: 1 }]}>
                <Text style={styles.label}>Año</Text>
                <TextInput
                  value={year}
                  onChangeText={(t) => setYear(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="numeric"
                  placeholder="2022"
                  placeholderTextColor="#9aa1aa"
                  style={styles.input}
                  maxLength={4}
                />
              </View>

              <View style={[styles.group, { flex: 1 }]}>
                <Text style={styles.label}>Placas (4 últimas letras/números)</Text>
                <TextInput
                  value={raw}
                  onChangeText={(t) => {
                    // Acepta letras, números y guiones mientras escribe
                    const sanitized = t.toUpperCase().replace(/[^A-Z0-9-]/g, "");
                    setRaw(sanitized);

                    // Extrae ÚLTIMOS 4 alfanuméricos (ignora guiones)
                    const alnum = sanitized.replace(/[^A-Z0-9]/g, "");
                    const suffix4 = alnum.slice(-4);
                    setPlate(suffix4);
                  }}
                  placeholder="12D-Y"
                  placeholderTextColor="#9aa1aa"
                  style={styles.input}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <TouchableOpacity onPress={onClose} style={[styles.btnOutline, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!valid}
                style={[styles.btn, { flex: 1, marginLeft: 8, opacity: valid ? 1 : 0.6 }]}
              >
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", alignItems: "center", justifyContent: "center", padding: 24 },
  sheet: { width: "100%", backgroundColor: CARD, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: BORDER },
  title: { fontSize: 18, fontWeight: "800", textAlign: "center", marginBottom: 10, color: TEXT },
  group: { marginBottom: 12 },
  label: { color: MUTED, fontSize: 12, marginBottom: 6 },
  input: { backgroundColor: "#f9fafb", borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: TEXT },
  btn: { backgroundColor: "#111827", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: { borderWidth: 2, borderColor: "#111827", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnOutlineText: { color: "#111827", fontWeight: "700" },
});
