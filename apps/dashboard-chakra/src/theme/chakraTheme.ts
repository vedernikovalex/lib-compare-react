import { createSystem, defaultConfig } from "@chakra-ui/react";
import tokens from "@shared/src/theme/tokens.json";

export const chakraSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: tokens.colors.primary },
          600: { value: tokens.colors.primaryActive },
        },
      },
      radii: { md: { value: `${tokens.borderRadius.md}px` } },
      fontSizes: { md: { value: `${tokens.fontSize.base}px` } },
    },
  },
});
