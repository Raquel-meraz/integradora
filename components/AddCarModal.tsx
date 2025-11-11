// components/AddCarModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { styles } from "./styles/AddCarModal.styles";

const VEHICULO_OPTS = [
  "carro chico",
  "carro grande",
  "camioneta chica",
  "camioneta grande",
  "motocicleta chica",
  "motocicleta grande",
];

export type Car = {
  id: string;
  name: string;
  year: string;
  plate: string;
  selected: boolean;
  color?: string;
  vehiculo?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
  car?: Car; // 👈 si viene, es edición
};

export default function AddCarModal({ visible, onClose, onSave, car }: Props) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [raw, setRaw] = useState("");
  const [color, setColor] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [tried, setTried] = useState(false);

  // cuando abre: si hay car = editar, si no, limpiar
  useEffect(() => {
    if (visible) {
      if (car) {
        setName(car.name);
        setYear(car.year);
        setPlate(car.plate);
        setRaw(car.plate);
        setColor(car.color ?? "");
        setVehiculo(car.vehiculo ?? "");
      } else {
        setName("");
        setYear("");
        setPlate("");
        setRaw("");
        setColor("");
        setVehiculo("");
      }
      setTried(false);
    }
  }, [visible, car]);

  const validName = name.trim().length >= 3;
  const validYear = /^\d{4}$/.test(year.trim());
  const validPlate = /^[A-Z0-9]{3}$/.test(plate.trim());
  const validColor = color.trim().length >= 3;
  const validVehiculo = vehiculo.trim().length > 0;

  const valid = validName && validYear && validPlate && validColor && validVehiculo;

  const handleSave = () => {
    setTried(true);
    if (!valid) {
      Alert.alert("Faltan datos", "Completa todos los campos para continuar.");
      return;
    }
    onSave({
      id: car ? car.id : String(Date.now()), // 👈 si edita, conserva id
      name: name.trim().toUpperCase(),
      year: year.trim(),
      plate: plate.trim().toUpperCase(),
      selected: false,
      color: color.trim(),
      vehiculo,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ width: "100%" }}>
          <View style={styles.sheet}>
            <Text style={styles.title}>{car ? "Editar auto" : "Nuevo auto"}</Text>

            {/* Marca / Modelo */}
            <View style={styles.group}>
              <Text style={styles.label}>Marca / Modelo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ej. NISSAN VERSA"
                placeholderTextColor="#9aa1aa"
                style={[styles.input, tried && !validName && { borderColor: "red" }]}
              />
            </View>

            {/* Año + Placas */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={[styles.group, { flex: 1 }]}>
                <Text style={styles.label}>Año</Text>
                <TextInput
                  value={year}
                  onChangeText={(t) => setYear(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="numeric"
                  placeholder="2022"
                  placeholderTextColor="#9aa1aa"
                  style={[styles.input, tried && !validYear && { borderColor: "red" }]}
                  maxLength={4}
                />
              </View>

              <View style={[styles.group, { flex: 1 }]}>
                <Text style={styles.label}>Placas (3 últimas letras/números)</Text>
                <TextInput
                  value={raw}
                  onChangeText={(t) => {
                    const only3 = t.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
                    setRaw(only3);
                    setPlate(only3);
                  }}
                  placeholder="12D"
                  placeholderTextColor="#9aa1aa"
                  style={[styles.input, tried && !validPlate && { borderColor: "red" }]}
                  autoCapitalize="characters"
                  maxLength={3}
                />
              </View>
            </View>

            {/* Color */}
            <View style={styles.group}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                value={color}
                onChangeText={setColor}
                placeholder="Rojo, blanco, gris..."
                placeholderTextColor="#9aa1aa"
                style={[styles.input, tried && !validColor && { borderColor: "red" }]}
              />
            </View>

            {/* Vehículo */}
            <View style={styles.group}>
              <Text style={styles.label}>Vehículo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                {VEHICULO_OPTS.map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() => setVehiculo(v)}
                    style={[styles.chip, vehiculo === v && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, vehiculo === v && styles.chipTextActive]}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {tried && !validVehiculo ? (
                <Text style={{ color: "red", fontSize: 11, marginTop: 4 }}>Selecciona un tipo de vehículo</Text>
              ) : null}
            </View>

            {/* Botones */}
            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <TouchableOpacity onPress={onClose} style={[styles.btnOutline, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!valid}
                style={[styles.btn, { flex: 1, marginLeft: 8, opacity: valid ? 1 : 0.6 }]}
              >
                <Text style={styles.btnText}>{car ? "Guardar cambios" : "Guardar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
