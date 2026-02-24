import { createTheme } from "@mui/material/styles";
import tokens from "@shared/src/theme/tokens.json";

export const muiTheme = createTheme({
  palette: {
    primary: { main: tokens.colors.primary },
    success: { main: tokens.colors.success },
    warning: { main: tokens.colors.warning },
    error: { main: tokens.colors.error },
  },
  typography: {
    fontSize: tokens.fontSize.base,
  },
  shape: { borderRadius: tokens.borderRadius.md },
});
