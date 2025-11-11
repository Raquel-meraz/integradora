// components/styles/ServiceModal.styles.ts
import { StyleSheet } from "react-native";

const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";

export const serviceModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    maxHeight: "90%",
  },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", color: TEXT, marginBottom: 10 },

  carCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  carTitle: { fontWeight: "800", color: TEXT, letterSpacing: 0.3 },
  carMeta: { color: MUTED, marginTop: 2, fontSize: 13 },

  subtitle: { fontSize: 12, color: MUTED, marginBottom: 6 },

  servicesScroll: {
    maxHeight: 260,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  rowActive: { backgroundColor: "#f3f4f6" },
  left: { fontSize: 16, color: TEXT, fontWeight: "600" },
  right: { fontSize: 14, color: TEXT },

  actions: { flexDirection: "row", marginTop: 4 },
  btn: {
    flex: 1,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnOutlineText: { color: ACCENT, fontWeight: "700" },
});
