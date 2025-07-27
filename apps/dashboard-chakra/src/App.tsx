import { Box, Heading, Container } from "@chakra-ui/react";

export default function App() {
  return (
    <Container maxW="6xl" py={8}>
      <Heading as="h1" size="lg" mb={4}>
        Demo Chakra Dashboard
      </Heading>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        textAlign="center"
        shadow="md"
      >
        <strong>Placeholder obsah</strong>
      </Box>
    </Container>
  );
}
