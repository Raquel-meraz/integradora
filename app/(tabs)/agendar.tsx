// app/(tabs)/agendar.tsx
import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

import AddCarModal, { type Car } from "../../components/AddCarModal";
import ServiceModal, { type Service } from "../../components/ServiceModal";
import { agendarStyles as styles } from "./styles/agendarStyles";

// mapas de color (se quedan aquí)
const BADGE_COLOR_MAP: Record<string, string> = {
  blanco: "#f3f4f6",
  white: "#f3f4f6",
  gris: "#e5e7eb",
  gray: "#e5e7eb",
  negro: "#e5e7eb",
  black: "#e5e7eb",
  rojo: "#fee2e2",
  azul: "#dbeafe",
  "azul marino": "#d1d5db",
  navy: "#d1d5db",
  verde: "#dcfce7",
  rosa: "#fce7f3",
  plata: "#e5e7eb",
  plateado: "#e5e7eb",
  naranja: "#ffedd5",
  anaranjado: "#ffedd5",
  amarillo: "#fef9c3",
  dorado: "#fef3c7",
  café: "#ede9fe",
  marrón: "#ede9fe",
  morado: "#ede9fe",
  vino: "#fee2e2",
};

const ICON_COLOR_MAP: Record<string, string> = {
  blanco: "#111827",
  white: "#111827",
  gris: "#111827",
  gray: "#111827",
  negro: "#111827",
  black: "#111827",
  rojo: "#b91c1c",
  azul: "#1d4ed8",
  "azul marino": "#1e3a8a",
  navy: "#1e3a8a",
  verde: "#15803d",
  rosa: "#be185d",
  plata: "#111827",
  plateado: "#111827",
  naranja: "#c05621",
  anaranjado: "#c05621",
  amarillo: "#b45309",
  dorado: "#b45309",
  café: "#4b5563",
  marrón: "#4b5563",
  morado: "#6d28d9",
  vino: "#9f1239",
};

const INITIAL_CARS: Car[] = [
  {
    id: "1",
    name: "SENTRA",
    year: "5678",
    plate: "679",
    selected: false,
    color: "rosa",
    vehiculo: "carro grande",
  },
  {
    id: "2",
    name: "SENTRA",
    year: "6789",
    plate: "677",
    selected: false,
    color: "naranja",
    vehiculo: "camioneta grande",
  },
];

const getVehicleIcon = (vehiculo?: string) => {
  const v = (vehiculo || "").toLowerCase();
  if (v.includes("moto")) return "motorbike";
  if (v.includes("camioneta")) return "car-pickup";
  return "car-sports";
};
const getBadgeColor = (color?: string) => {
  const c = (color || "").toLowerCase().trim();
  return BADGE_COLOR_MAP[c] ?? "#e5e7eb";
};
const getIconColor = (color?: string) => {
  const c = (color || "").toLowerCase().trim();
  return ICON_COLOR_MAP[c] ?? "#111827";
};

export default function Schedule() {
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [addOpen, setAddOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const header = useMemo(() => <Text style={styles.bigTitle}>seleccionar auto</Text>, []);

  const selectOnly = (id: string) => {
    setCars((prev) => prev.map((c) => ({ ...c, selected: c.id === id })));
  };

  const openServiceFor = (car: Car) => {
    setSelectedCar(car);
    setServiceOpen(true);
  };

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
          const iconName = getVehicleIcon(item.vehiculo);
          const badgeColor = getBadgeColor(item.color);
          const iconColor = getIconColor(item.color);

          return (
            <View style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={[styles.iconBox, { backgroundColor: badgeColor }]}>
                  <MaterialCommunityIcons name={iconName as any} size={30} color={iconColor} />
                </View>

                <Pressable style={{ flex: 1 }} onPress={() => selectOnly(item.id)}>
                  <Text style={styles.carTitle}>{item.name}</Text>
                  <Text style={styles.carMeta}>
                    {item.year}   {item.plate}
                  </Text>
                  {(item.color || item.vehiculo) && (
                    <Text style={styles.carMeta2}>
                      {item.color ? item.color : ""} {item.color && item.vehiculo ? "• " : ""}
                      {item.vehiculo ? item.vehiculo : ""}
                    </Text>
                  )}
                </Pressable>

                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    hitSlop={8}
                    style={{ marginRight: 12 }}
                    onPress={() => {
                      setEditingCar(item);
                      setAddOpen(true);
                    }}
                  >
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

      <ServiceModal
        visible={serviceOpen}
        car={selectedCar}
        onClose={() => setServiceOpen(false)}
        onConfirm={onConfirmService}
      />

      <AddCarModal
        visible={addOpen}
        car={editingCar ?? undefined}
        onClose={() => {
          setAddOpen(false);
          setEditingCar(null);
        }}
        onSave={(car) => {
          if (editingCar) {
            setCars((prev) => prev.map((c) => (c.id === editingCar.id ? { ...car, id: editingCar.id } : c)));
          } else {
            setCars((prev) => [{ ...car, selected: false }, ...prev.map((c) => ({ ...c, selected: false }))]);
          }
          setAddOpen(false);
          setEditingCar(null);
          Alert.alert("Listo", editingCar ? "Vehículo actualizado." : "Auto agregado.");
        }}
      />

      <Pressable
        style={styles.fab}
        onPress={() => {
          setEditingCar(null);
          setAddOpen(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
