import { Appearance, StyleSheet } from "react-native";

const light = {
  paper: "#f7f6f3",
  ink: "#1c1b19",
  muted: "#8a867e",
  rule: "#e3e0da",
  gain: "#2e6f4e",
  loss: "#a33a2a",
};

const dark = {
  paper: "#161513",
  ink: "#f2f0ec",
  muted: "#8d897f",
  rule: "#2a2825",
  gain: "#5fa97e",
  loss: "#d4634e",
};

export function getColors() {
  return Appearance.getColorScheme() === "dark" ? dark : light;
}

export const theme = {
  get colors() {
    return getColors();
  },
  type: {
    pnl: 56,
    status: 24,
    section: 20,
    value: 17,
    body: 16,
    meta: 14,
  },
  radii: {
    card: 12,
    control: 8,
  },
  space: {
    pageX: 20,
    pageY: 32,
    hairline: 32,
  },
};

export const shared = StyleSheet.create({
  fillButton: {
    height: 48,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    height: 48,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 48,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
