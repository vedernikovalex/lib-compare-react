import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useTranslations } from "@shared/src/hooks/useTranslations";
import { useNavigate } from "react-router-dom";

const libraryKeys = ["mui", "antd", "chakra"] as const;
type LibraryKey = (typeof libraryKeys)[number];

const criteriaKeys = [
  "performance",
  "accessibility",
  "dx",
  "ecosystem",
  "theming",
] as const;
type CriterionKey = (typeof criteriaKeys)[number];

const HomePage = () => {
  const { t } = useTranslations("homepage");
  const { t: tGlobal } = useTranslations("global");
  const navigate = useNavigate();

  return (
    <Container maxW="container.lg" py={{ base: 12, md: 16 }}>
      <Flex direction="column" gap={12}>
        <Flex direction="column" gap={4}>
          <Text textTransform="uppercase" color="gray.500" fontWeight="medium">
            {tGlobal("appTitle")}
          </Text>
          <Heading as="h1" size="xl">
            {tGlobal("appTagline")}
          </Heading>
          <Text color="gray.400">{t("intro.description")}</Text>
          <Flex direction={{ base: "column", sm: "row" }} gap={4}>
            <Button
              colorPalette="purple"
              onClick={() => navigate("/dashboard")}
            >
              {tGlobal("cta.goToDashboard")}
            </Button>
            <Button variant="outline" onClick={() => navigate("/kanban")}>
              {tGlobal("cta.goToKanban")}
            </Button>
          </Flex>
        </Flex>

        <Flex direction="column" gap={4}>
          <Heading as="h2" size="lg">
            {t("libraries.title")}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            {libraryKeys.map((key: LibraryKey) => (
              <Box
                key={key}
                borderWidth="1px"
                borderRadius="lg"
                p={5}
                height="100%"
              >
                <Flex direction="column" gap={2}>
                  <Heading as="h3" size="sm">
                    {t(`libraries.${key}.name`)}
                  </Heading>
                  <Text color="gray.400">
                    {t(`libraries.${key}.description`)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>

        <Flex direction="column" gap={4}>
          <Heading as="h2" size="lg">
            {t("criteria.title")}
          </Heading>
          <Flex direction="column" gap={2}>
            {criteriaKeys.map((key: CriterionKey) => (
              <Box key={key} borderWidth="1px" borderRadius="md" px={4} py={3}>
                <Flex gap={4} align="baseline">
                  <Text fontWeight="semibold" minWidth="160px">
                    {t(`criteria.${key}.label`)}
                  </Text>
                  <Text fontWeight="bold" color="purple.400" minWidth="48px">
                    {t(`criteria.${key}.weight`)}
                  </Text>
                  <Text color="gray.400">
                    {t(`criteria.${key}.description`)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default HomePage;
