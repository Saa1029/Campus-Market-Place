import { ThemeMode } from "./types";

export const themeColors = {
  light: {
    background: "#F8F8F4",
    card: "#FFFFFF",
    cardSecondary: "#F2F5F0",
    text: "#173C34",
    textSecondary: "#4A5A52",
    muted: "#87918C",
    border: "#E9ECE6",
    primary: "#1F5D4C",
    primaryLight: "#E4EDE6",
    accent: "#1C7057",
    danger: "#B64950",
    dangerLight: "#FDF0F1",
    warning: "#B0792E",
    warningLight: "#FEF7EE",
    navBg: "#FFFFFF",
    navBorder: "#E8EBE5",
    inputBg: "#F7F9F6",
  },
  dark: {
    background: "#111816",
    card: "#1B2522",
    cardSecondary: "#23332E",
    text: "#F0F4F2",
    textSecondary: "#A7B8B0",
    muted: "#7A8C84",
    border: "#283934",
    primary: "#34B38A",
    primaryLight: "#18382F",
    accent: "#43C298",
    danger: "#E57373",
    dangerLight: "#3E1E22",
    warning: "#F0B429",
    warningLight: "#3B2F15",
    navBg: "#16201D",
    navBorder: "#243530",
    inputBg: "#172320",
  },
};

export type ThemeColors = typeof themeColors.light;
