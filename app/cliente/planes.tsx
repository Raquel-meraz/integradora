// app/cliente/planes.tsx
import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* ===== Paleta ===== */
const BG = "#f3f4f6";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";

/* ===== Tipos ===== */
type ServiceKey =
  | "basico"
  | "premium"
  | "encerado"
  | "pulido"
  | "detInterior"
  | "detCompleto";

type VehicleKind = "vehiculo" | "moto";

type Vehicle = {
  id: string;
  name: string;
  icon: keyof typeof ICONS;
  accent: string;
  kind: VehicleKind;
  prices: Partial<Record<ServiceKey, number>>;
};

const ICONS = {
  carroChico: "car-hatchback",
  carroGrande: "car-estate",
  camionetaChica: "pickup-truck",
  camionetaGrande: "truck",
  motoChica: "motorbike",
  motoGrande: "motorbike",
} as const;

/* ===== Etiquetas de servicios ===== */
const LABELS: Record<ServiceKey, string> = {
  basico: "Lavado básico",
  premium: "Lavado premium",
  encerado: "Encerado",
  pulido: "Pulido",
  detInterior: "Detallado interior",
  detCompleto: "Detallado completo",
};

/* Orden por tipo */
const SERVICES_VEHICULO: ServiceKey[] = [
  "basico",
  "premium",
  "encerado",
  "pulido",
  "detInterior",
  "detCompleto",
];
const SERVICES_MOTO: ServiceKey[] = [
  "basico",
  "premium",
  "encerado",
  "pulido",
  "detCompleto", // sin "Detallado interior"
];

/* ===== Datos ===== */
export const VEHICLES: Vehicle[] = [
  {
    id: "carro_chico",
    name: "Carro chico",
    icon: "carroChico",
    accent: "#e5e7eb",
    kind: "vehiculo",
    prices: {
      basico: 100,
      premium: 150,
      encerado: 150,
      pulido: 300,
      detInterior: 250,
      detCompleto: 450,
    },
  },
  {
    id: "carro_grande",
    name: "Carro grande",
    icon: "carroGrande",
    accent: "#bae6fd",
    kind: "vehiculo",
    prices: {
      basico: 120,
      premium: 200,
      encerado: 200,
      pulido: 350,
      detInterior: 300,
      detCompleto: 500,
    },
  },
  {
    id: "camioneta_chica",
    name: "Camioneta chica",
    icon: "camionetaChica",
    accent: "#bbf7d0",
    kind: "vehiculo",
    prices: {
      basico: 140,
      premium: 230,
      encerado: 230,
      pulido: 380,
      detInterior: 330,
      detCompleto: 540,
    },
  },
  {
    id: "camioneta_grande",
    name: "Camioneta grande",
    icon: "camionetaGrande",
    accent: "#fde68a",
    kind: "vehiculo",
    prices: {
      basico: 160,
      premium: 260,
      encerado: 260,
      pulido: 420,
      detInterior: 370,
      detCompleto: 600,
    },
  },
  {
    id: "moto_chica",
    name: "Motocicleta chica",
    icon: "motoChica",
    accent: "#e9d5ff",
    kind: "moto",
    prices: {
      basico: 60,
      premium: 90,
      encerado: 100,
      pulido: 160,
      detCompleto: 180,
    },
  },
  {
    id: "moto_grande",
    name: "Motocicleta grande",
    icon: "motoGrande",
    accent: "#fecaca",
    kind: "moto",
    prices: {
      basico: 80,
      premium: 110,
      encerado: 130,
      pulido: 190,
      detCompleto: 220,
    },
  },
];

/* ===== Util ===== */
function formatMXN(n?: number) {
  if (typeof n !== "number") return "—";
  try {
    // @ts-ignore
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  } catch {
    return `$${n}`;
  }
}

/* ===== UI ===== */
function ServiceRow({ label, value }: { label: string; value?: number }) {
  return (
    <View style={sp.row}>
      <Text style={sp.rowLeft}>{label}</Text>
      <Text style={sp.rowRight}>{formatMXN(value)}</Text>
    </View>
  );
}

function VehicleCard({
  v,
  widthPercent,
  onSelect,
}: {
  v: Vehicle;
  widthPercent: string;
  onSelect?: (v: Vehicle) => void;
}) {
  const order = v.kind === "moto" ? SERVICES_MOTO : SERVICES_VEHICULO;

  return (
    <View style={[sp.card, { width: widthPercent }]}>
      <View style={[sp.cardAccent, { backgroundColor: v.accent }]} />
      <View style={sp.cardBody}>
        <View style={sp.titleRow}>
          <View style={sp.iconBox}>
            <MaterialCommunityIcons name={ICONS[v.icon]} size={20} color="#374151" />
          </View>
          <Text style={sp.cardTitle}>{v.name}</Text>
        </View>

        <Text style={sp.blockTitle}>Servicios</Text>
        <View>
          {order.map((key) => (
            <ServiceRow key={key} label={LABELS[key]} value={v.prices[key]} />
          ))}
        </View>

        <Pressable
          onPress={() => (onSelect ? onSelect(v) : router.push("/agendar"))}
          style={({ pressed }) => [sp.cta, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
        >
          <Text style={sp.ctaTxt}>Pedir este servicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ===== Sección reutilizable ===== */
export function PlanesSection({
  title = "Servicios por tipo de vehículo",
  subtitle = "Elige tu vehículo y revisa los precios por servicio.",
  onSelect,
}: {
  title?: string;
  subtitle?: string;
  onSelect?: (v: Vehicle) => void;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 800;
  const cardWidth = isWide ? "48%" : "100%";

  return (
    <View style={sp.section}>
      <Text style={sp.sectionTitle}>{title}</Text>
      <Text style={sp.sectionSub}>{subtitle}</Text>

      <View style={[sp.wrap, isWide ? { justifyContent: "space-between" } : null]}>
        {VEHICLES.map((v) => (
          <VehicleCard key={v.id} v={v} widthPercent={cardWidth} onSelect={onSelect} />
        ))}
      </View>

      <Text style={sp.leyenda}>
        *Los precios pueden variar por condiciones del vehículo (lodo, pelo de mascota, detailing, etc.).
        Solicita cotización exacta con el personal.
      </Text>
    </View>
  );
}

/* ===== Pantalla completa ===== */
export default function PlanesScreen() {
  return (
    <ScrollView style={{ backgroundColor: BG }} contentContainerStyle={{ padding: 16 }}>
      <PlanesSection onSelect={() => router.push("/agendar")} />
    </ScrollView>
  );
}

/* ===== Estilos ===== */
const sp = StyleSheet.create({
  section: { marginTop: 18 },
  sectionTitle: { color: TEXT, fontSize: 18, fontWeight: "800" },
  sectionSub: { color: MUTED, marginTop: 4 },

  wrap: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 12 },

  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardAccent: { height: 6, width: "100%" },
  cardBody: { padding: 16 },

  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: TEXT },

  blockTitle: { marginTop: 6, marginBottom: 6, fontWeight: "800", color: TEXT },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowLeft: { color: "#374151", flex: 1, paddingRight: 8 },
  rowRight: { fontWeight: "700", color: TEXT },

  cta: {
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  ctaTxt: { color: "#fff", fontWeight: "700" },

  leyenda: { color: MUTED, fontSize: 12, marginTop: 8 },
});
