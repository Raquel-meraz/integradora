// app/(tabs)/styles/citas.tsx
import { StyleSheet } from "react-native";

const BG = "#f3f4f6";
const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 6,
    color: TEXT,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: "#111827",
  },
  tabText: {
    color: TEXT,
    fontWeight: "700",
    fontSize: 12,
  },
  tabTextActive: {
    color: "#fff",
  },

  groupHeader: {
    color: MUTED,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 6,
    textTransform: "uppercase",
    fontSize: 12,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW,
    marginBottom: 10,
  },

  carTitle: {
    fontWeight: "800",
    letterSpacing: 0.3,
    color: TEXT,
  },
  meta: {
    color: MUTED,
    marginTop: 2,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgePend: {
    borderColor: "#fed7aa",
    backgroundColor: "#fffbeb",
  },
  badgeDone: {
    borderColor: "#a7f3d0",
    backgroundColor: "#ecfdf5",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  smallBtnText: {
    marginLeft: 6,
    fontSize: 12,
    color: TEXT,
    fontWeight: "700",
  },
});
