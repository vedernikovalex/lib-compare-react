import tokens from "@shared/src/theme/tokens.json";
import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.colors.primary,
    colorSuccess: tokens.colors.success,
    colorWarning: tokens.colors.warning,
    colorError: tokens.colors.error,
    borderRadius: tokens.borderRadius.md,
    fontSize: tokens.fontSize.base,
  },
};
