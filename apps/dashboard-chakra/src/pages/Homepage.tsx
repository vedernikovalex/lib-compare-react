import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { highlightKeys } from "@shared/src/data/homepage.data";
import { useTranslations } from "@shared/src/hooks/useTranslations";

const HomePage = () => {
  const { t } = useTranslations("homepage");
  const { t: tGlobal } = useTranslations("global");

  const typedKeys = highlightKeys as Array<
    "featureParity" | "performanceBenchmarks" | "accessibilityGoals"
  >;

  return (
    <Container maxW="container.lg" py={{ base: 12, md: 16 }}>
      <Flex direction="column" gap={10}>
        <Flex direction="column" gap={4}>
          <Text textTransform="uppercase" color="gray.500" fontWeight="medium">
            {tGlobal("appTitle")}
          </Text>
          <Heading as="h1" size="xl">
            {tGlobal("appTagline")}
          </Heading>
          <Text color="gray.400">{t("intro.description")}</Text>
          <Flex direction={{ base: "column", sm: "row" }} gap={4}>
            <Button colorScheme="purple">
              {tGlobal("cta.viewMeasurementProtocol")}
            </Button>
            <Button variant="outline">
              {tGlobal("cta.browseLatestResults")}
            </Button>
          </Flex>
        </Flex>

        <Box borderWidth="1px" borderRadius="lg" p={{ base: 6, md: 8 }}>
          <Flex direction="column" gap={6}>
            <Heading as="h2" size="md">
              {t("section.whatYouWillFind")}
            </Heading>
            <Box height="1px" bg="whiteAlpha.300" />
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              {typedKeys.map((key) => (
                <Flex key={key} direction="column" gap={2}>
                  <Heading as="h3" size="sm">
                    {t(`highlights.${key}.title`)}
                  </Heading>
                  <Text color="gray.400">
                    {t(`highlights.${key}.description`)}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default HomePage;
