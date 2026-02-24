import { Box, HStack, Text, Button } from "@chakra-ui/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslations } from "@shared/src/hooks/useTranslations";

const NAV_ITEMS = [
  { to: "/", labelKey: "home" as const },
  { to: "/dashboard", labelKey: "dashboard" as const },
  { to: "/kanban", labelKey: "kanban" as const },
] as const;

const AppLayout = () => {
  const { t } = useTranslations("nav");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Box as="header" bg="gray.800" px={6} py={3} boxShadow="sm">
        <HStack gap={8}>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color="white"
            whiteSpace="nowrap"
          >
            Chakra App
          </Text>
          <Box as="nav" aria-label="Main navigation">
            <HStack as="ul" gap={2} listStyleType="none" m={0} p={0}>
              {NAV_ITEMS.map(({ to, labelKey }) => (
                <Box as="li" key={to}>
                  <Button
                    size="sm"
                    variant={location.pathname === to ? "solid" : "ghost"}
                    colorPalette={location.pathname === to ? "blue" : undefined}
                    color="white"
                    onClick={() => navigate(to)}
                  >
                    {t(labelKey)}
                  </Button>
                </Box>
              ))}
            </HStack>
          </Box>
        </HStack>
      </Box>
      <Box as="main" flex={1} p={6}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
