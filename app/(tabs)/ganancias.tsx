import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { styles } from "../styles/gananciasStyles";

/** ====== Tipos ====== */
type Periodo = "hoy" | "semana" | "mes";
type GananciaServicio = { nombre: string; monto: number };
type Dataset = {
  barras7: number[];
  total: number;
  servicios: GananciaServicio[];
};

/** ====== Util ====== */
const $ = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    n || 0
  );

/** Simula datos (cuando conectes BD, reemplaza esta función) */
function usarDatosGanancias(periodo: Periodo): Dataset {
  const datasets: Record<Periodo, Dataset> = {
    hoy: {
      barras7: [180, 320, 210, 480, 120, 260, 200],
      total: 450,
      servicios: [
        { nombre: "Lavado completo", monto: 250 },
        { nombre: "Lavado exterior", monto: 120 },
        { nombre: "Encerado", monto: 80 },
      ],
    },
    semana: {
      barras7: [600, 750, 420, 980, 300, 520, 450],
      total: 4020,
      servicios: [
        { nombre: "Lavado completo", monto: 2100 },
        { nombre: "Lavado exterior", monto: 1200 },
        { nombre: "Encerado", monto: 720 },
      ],
    },
    mes: {
      barras7: [2200, 1900, 2600, 2400, 2900, 2100, 3100],
      total: 26800,
      servicios: [
        { nombre: "Lavado completo", monto: 12600 },
        { nombre: "Lavado exterior", monto: 8400 },
        { nombre: "Encerado", monto: 5800 },
      ],
    },
  };

  return datasets[periodo];
}

/** ====== UI ====== */

function Segmento({
  activo,
  label,
  onPress,
}: {
  activo: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.segChip, activo && styles.segChipActivo]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.segChipTxt, activo && styles.segChipTxtActivo]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const labels = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartBars}>
        {data.map((v, i) => {
          const hPct = (v / max) * 100;
          return (
            <View key={i} style={styles.barItem}>
              <View style={[styles.bar, { height: `${hPct}%` }]} />
              <Text style={styles.barLbl}>{labels[i]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function GananciasScreen() {
  const [periodo, setPeriodo] = useState<Periodo>("hoy");
  const [refreshing, setRefreshing] = useState(false);

  const datos = usarDatosGanancias(periodo);
  const totalFormateado = useMemo(() => $(datos.total), [datos.total]);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: aquí harías tu refetch real
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.title}>Ganancias</Text>
        </View>

        {/* Segmented Control */}
        <View style={styles.card}>
          <View style={styles.segmented}>
            <Segmento
              label="Hoy"
              activo={periodo === "hoy"}
              onPress={() => setPeriodo("hoy")}
            />
            <Segmento
              label="Semana"
              activo={periodo === "semana"}
              onPress={() => setPeriodo("semana")}
            />
            <Segmento
              label="Mes"
              activo={periodo === "mes"}
              onPress={() => setPeriodo("mes")}
            />
          </View>
        </View>

        {/* Total */}
        <View style={styles.card}>
          <Text style={styles.cardCaption}>Total de {periodo}</Text>
          <Text style={styles.total}>{totalFormateado}</Text>
        </View>

        {/* Últimos 7 días (mini chart) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Últimos 7 días</Text>
          <MiniBarChart data={datos.barras7} />
        </View>

        {/* Servicios con más ingreso */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Servicios con más ingreso</Text>
          {datos.servicios.map((s, i) => (
            <View key={s.nombre + i} style={styles.serviceRow}>
              <Text style={styles.serviceName}>{s.nombre}</Text>
              <Text style={styles.serviceAmount}>{$(s.monto)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
