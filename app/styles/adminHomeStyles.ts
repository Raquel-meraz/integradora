// app/styles/adminHomeStyles.ts
import { StyleSheet } from "react-native";

export const BG = "#f3f4f6";
export const CARD = "#ffffff";
export const TEXT = "#111827";
export const MUTED = "#6b7280";
export const BORDER = "#e5e7eb";
export const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 8 },

  searchBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: CARD,
    borderRadius: 12, paddingHorizontal: 10, height: 40, borderWidth: 1, borderColor: BORDER,
    ...SHADOW, marginBottom: 12
  },
  searchInput: { marginLeft: 8, flex: 1 },

  sectionTitle: { color: MUTED, fontSize: 14, marginBottom: 8 },

  card: {
    backgroundColor: CARD, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: BORDER, ...SHADOW, marginBottom: 16
  },
  chip: { backgroundColor: "#e5e7eb", borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10, alignSelf: "flex-start", marginTop: 8 },
  chipText: { color: "#374151", fontSize: 12 },

  cardTitle: { fontSize: 16, fontWeight: "700", color: TEXT },
  cardTitleSmall: { fontSize: 15, fontWeight: "700", color: TEXT },
  cardSubtitle: { color: TEXT, opacity: 0.9, marginTop: 2 },
  cardMinor: { color: MUTED, marginTop: 2, fontSize: 13 },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  statCard: { flex: 1, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: TEXT },
  statLabel: { color: MUTED, marginTop: 4 },

  // KPI dinero
  moneyCard: { flexDirection: "row", alignItems: "center", gap: 8 },
  statValueSm: { fontSize: 18, fontWeight: "800", color: TEXT },

  // badges
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  badgePend: { borderColor: "#fed7aa", backgroundColor: "#fffbeb" },
  badgeText: { fontSize: 12, fontWeight: "700" },
});

export const stylesP = StyleSheet.create({
  group: {
    backgroundColor: CARD,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW,
  },
  item: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemTitle: {
    fontSize: 15,
    color: TEXT,
    fontWeight: "600",
  },
  logoutBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOW,
  },
  logoutTxt: {
    color: "#DC2626",
    fontWeight: "700",
  },

  // layout de fila para buscador + chip
searchRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" },

// chip de ganancias (look tipo pill, tono suave)
earnPill: {
  backgroundColor: "#eef2ff",        // ligero indigo
  borderColor: "#c7d2fe",
  borderWidth: 1,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 999,
  ...SHADOW,
},
earnPillText: { fontSize: 12, fontWeight: "800", color: "#3730a3" },
earnPillMoney: { color: "#111827", fontWeight: "900" },

});
