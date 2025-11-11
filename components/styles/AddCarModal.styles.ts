import { StyleSheet } from "react-native";

const CARD = "#ffffff";
const TEXT = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#111827";
const PLACEHOLDER = "#9aa1aa";

export const COLORS = {
  card: CARD,
  text: TEXT,
  muted: MUTED,
  border: BORDER,
  accent: ACCENT,
  placeholder: PLACEHOLDER,
};

export const styles = StyleSheet.create({
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
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: TEXT,
  },
  group: {
    marginBottom: 12,
  },
  label: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: TEXT,
  },
  inputError: {
    borderColor: "red",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  chipText: {
    color: TEXT,
    fontSize: 12,
  },
  chipTextActive: {
    color: "#fff",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 8,
  },
  btn: {
    backgroundColor: ACCENT,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: ACCENT,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnOutlineText: {
    color: ACCENT,
    fontWeight: "700",
  },
  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: 4,
  },
});