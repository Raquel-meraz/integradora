// app/(tabs)/styles/adminHomeStyles.ts
import { StyleSheet } from "react-native";

const BG = "#f3f4f6";
export const TEXT = "#111827";
export const MUTED = "#6b7280";
export const BORDER = "#e5e7eb";
const CARD = "#ffffff";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    gap: 8,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 6,
    color: TEXT,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },
  cardTitleSmall: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT,
  },
  cardSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  cardMinor: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    borderColor: "#c7d2fe",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgePend: {
    backgroundColor: "#fffbeb",
    borderColor: "#fed7aa",
  },
  badgeDone: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});

export const stylesP = StyleSheet.create({
  group: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 10,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemTitle: {
    fontSize: 14,
    color: TEXT,
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  logoutTxt: {
    color: "#dc2626",
    fontWeight: "700",
  },
});
