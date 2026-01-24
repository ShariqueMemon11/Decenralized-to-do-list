// App Theme Constants
export const theme = {
  colors: {
    primary: "#3b2b55",
    onPrimary: "#FFFFFF",
    secondary: "#4CAF50",
    accent: "#2196F3",
    danger: "#f44336",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#000000",
    textSecondary: "#666666",
    textLight: "#999999",
    border: "#CCCCCC",
    completed: "#E8F5E9",
    pending: "#F2F2F2",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    full: 9999,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    title: 24,
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  } as const,
} as const;

