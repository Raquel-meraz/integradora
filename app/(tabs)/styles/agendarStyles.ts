// app/(tabs)/styles/agendarStyles.ts
import { StyleSheet } from "react-native";

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

export const agendarStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 8 },

  bigTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 6,
    color: TEXT,
    textTransform: "lowercase",
  },

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

  iconBox: {
    width: 64,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  carTitle: { fontWeight: "800", letterSpacing: 0.3, color: TEXT },
  carMeta: { color: MUTED, marginTop: 2 },
  carMeta2: { color: MUTED, marginTop: 2, fontSize: 12 },

  btn: {
    backgroundColor: ACCENT,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
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
