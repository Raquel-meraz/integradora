// components/ServiceModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { serviceModalStyles as styles } from "./styles/ServiceModal.styles";

export type Service = { id: string; label: string; price: number; timeMin: number };

const SERVICES: Service[] = [
  { id: "ext", label: "Exterior", price: 120, timeMin: 30 },
  { id: "int", label: "Interior", price: 130, timeMin: 40 },
  { id: "full", label: "Completo", price: 200, timeMin: 70 },
  { id: "basic", label: "Lavado básico", price: 110, timeMin: 25 },
  { id: "prem", label: "Lavado premium", price: 160, timeMin: 35 },
  { id: "wax", label: "Encerado", price: 180, timeMin: 45 },
  { id: "polish", label: "Pulido", price: 250, timeMin: 60 },
  { id: "det-int", label: "Detallado interior", price: 220, timeMin: 55 },
  { id: "det-full", label: "Detallado completo", price: 320, timeMin: 80 },
];

type CarLike = { name: string; year: string; plate: string };

type Props = {
  visible: boolean;
  car?: CarLike | null;
  onClose: () => void;
  onConfirm: (service: Service) => void;
};

export default function ServiceModal({ visible, car, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Agendar cita</Text>

          {car && (
            <View style={styles.carCard}>
              <MaterialCommunityIcons name="car-hatchback" size={24} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.carTitle}>{car.name}</Text>
                <Text style={styles.carMeta}>
                  {car.year}    {car.plate}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.subtitle}>Servicios</Text>

          <ScrollView style={styles.servicesScroll}>
            {SERVICES.map((s) => {
              const active = selected?.id === s.id;
              return (
                <Pressable
                    key={s.id}
                    onPress={() => setSelected(s)}
                    style={[styles.row, active && styles.rowActive]}
                >
                  <Text style={styles.left}>{s.label}</Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.right}>${s.price}</Text>
                    <Text style={[styles.right, { color: "#6b7280" }]}>{s.timeMin} min.</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.btnOutline, { marginRight: 8 }]}>
              <Text style={styles.btnOutlineText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!selected}
              onPress={() => selected && onConfirm(selected)}
              style={[styles.btn, { marginLeft: 8, opacity: selected ? 1 : 0.6 }]}
            >
              <Text style={styles.btnText}>seleccionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
