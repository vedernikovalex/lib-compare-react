import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslations } from "@shared/src/hooks/useTranslations";

const NAV_ITEMS = [
  { to: "/", labelKey: "home" as const },
  { to: "/dashboard", labelKey: "dashboard" as const },
  { to: "/kanban", labelKey: "kanban" as const },
] as const;

const AppLayout = () => {
  const { t } = useTranslations("nav");
  const location = useLocation();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component="span"
            sx={{ mr: 4, fontWeight: 700 }}
          >
            MUI App
          </Typography>
          <Box
            component="nav"
            aria-label="Main navigation"
            display="flex"
            gap={1}
          >
            {NAV_ITEMS.map(({ to, labelKey }) => (
              <Button
                key={to}
                component={Link}
                to={to}
                color={location.pathname === to ? "primary" : "inherit"}
                variant={location.pathname === to ? "contained" : "text"}
                size="small"
              >
                {t(labelKey)}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" flex={1} py={3}>
        <Container>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;
