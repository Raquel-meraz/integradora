// app/agendar.tsx
import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

import AddCarModal, { type Car } from "../../components/AddCarModal";
import ServiceModal, { type Service } from "../../components/ServiceModal";

const BG = "#f3f4f6";
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

const INITIAL_CARS: Car[] = [
  { id: "1", name: "NISSAN VERSA", year: "2020", plate: "ABCD12", selected: false },
  { id: "2", name: "NISSAN VERSA", year: "2022", plate: "ZXT012", selected: false },
];

export default function Schedule() {
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [addOpen, setAddOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const header = useMemo(() => <Text style={styles.bigTitle}>seleccionar auto</Text>, []);

  // Selección EXCLUSIVA: solo uno a la vez
  const selectOnly = (id: string) => {
    setCars((prev) => prev.map((c) => ({ ...c, selected: c.id === id })));
  };

  // Abre modal de servicios para el auto
  const openServiceFor = (car: Car) => {
    setSelectedCar(car);
    setServiceOpen(true);
  };

  // Al confirmar servicio -> navegar a /fecha-hora con params
  const onConfirmService = (service: Service) => {
    setServiceOpen(false);
    if (!selectedCar) return;

    router.push({
      pathname: "/fecha-hora",
      params: {
        car: selectedCar.name,
        year: selectedCar.year,
        plate: selectedCar.plate,
        service: service.label,
        sid: service.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {header}

      <FlatList
        data={cars}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => {
          const isSelected = item.selected;
          return (
            <View style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="car-hatchback" size={30} style={{ marginRight: 12 }} />

                {/* Toca para seleccionar */}
                <Pressable style={{ flex: 1 }} onPress={() => selectOnly(item.id)}>
                  <Text style={styles.carTitle}>{item.name}</Text>
                  <Text style={styles.carMeta}>
                    {item.year}    {item.plate}
                  </Text>
                </Pressable>

                {/* Acciones */}
                <View style={{ flexDirection: "row" }}>
                  <Pressable hitSlop={8} style={{ marginRight: 12 }}>
                    <Feather name="edit-2" size={18} />
                  </Pressable>
                  <Pressable
                    hitSlop={8}
                    style={{ marginRight: 12 }}
                    onPress={() => setCars((prev) => prev.filter((c) => c.id !== item.id))}
                  >
                    <Feather name="trash-2" size={18} />
                  </Pressable>
                </View>
              </View>

              {/* Botón Agendar SOLO si está seleccionado */}
              {isSelected && (
                <Pressable
                  style={[styles.btn, { marginTop: 12, alignSelf: "flex-end" }]}
                  onPress={() => openServiceFor(item)}
                >
                  <Text style={styles.btnText}>Agendar</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />

      {/* Modal servicios */}
      <ServiceModal
        visible={serviceOpen}
        car={selectedCar}
        onClose={() => setServiceOpen(false)}
        onConfirm={onConfirmService}
      />

      {/* Modal agregar auto */}
      <AddCarModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(car) => {
          setCars((prev) => [{ ...car, selected: false }, ...prev.map((c) => ({ ...c, selected: false }))]);
          setAddOpen(false);
          Alert.alert("Listo", "Auto agregado.");
        }}
      />

      {/* FAB -> formulario agregar auto */}
      <Pressable style={styles.fab} onPress={() => setAddOpen(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 8 },
  bigTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginVertical: 6, color: TEXT, textTransform: "lowercase" },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW,
    marginBottom: 14,
  },
  cardSelected: { borderColor: ACCENT, borderWidth: 2 },

  carTitle: { fontWeight: "800", letterSpacing: 0.3, color: TEXT },
  carMeta: { color: MUTED, marginTop: 2 },

  btn: { backgroundColor: ACCENT, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },

  fab: {
    position: "absolute",
    bottom: 22,
    right: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW,
  },
});
