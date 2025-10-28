import { StyleSheet } from "react-native";

/** ====== Paleta ====== */
export const BG = "#F6F8FC";
export const CARD = "#FFFFFF";
export const BORDER = "#E6E9F0";
export const TEXT = "#141822";
export const MUTED = "#767F92";
export const PRIMARY = "#5443EA";      // morado
export const PRIMARY_SOFT = "#ECEFFF";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 8, paddingBottom: 6 },
  title: { fontSize: 22, fontWeight: "700", color: TEXT },

  /** Cards */
  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: TEXT, fontWeight: "700", marginBottom: 10 },
  cardCaption: { fontSize: 12, color: MUTED, marginBottom: 8 },

  /** Segmented control */
  segmented: {
    backgroundColor: "#F1F2F7",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 4,
    flexDirection: "row",
    gap: 6,
  },
  segChip: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segChipActivo: { backgroundColor: PRIMARY_SOFT, borderWidth: 1, borderColor: "#D6DAFF" },
  segChipTxt: { fontSize: 12, fontWeight: "600", color: MUTED },
  segChipTxtActivo: { color: PRIMARY },

  /** Total */
  total: { fontSize: 36, fontWeight: "800", color: PRIMARY, marginTop: 6 },

  /** Chart */
  chartWrap: { marginTop: 8 },
  chartBars: {
    height: 130,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  barItem: { width: 24, alignItems: "center" },
  bar: { width: 24, backgroundColor: PRIMARY_SOFT, borderColor: "#D6DAFF", borderWidth: 1, borderRadius: 8 },
  barLbl: { fontSize: 12, color: MUTED, marginTop: 6 },

  /** Servicios */
  serviceRow: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  serviceName: { fontSize: 13, color: TEXT, fontWeight: "600" },
  serviceAmount: { fontSize: 13, color: MUTED, fontWeight: "600" },
});

// ✅ Export por defecto + nombrado (ambos)
export default styles;
