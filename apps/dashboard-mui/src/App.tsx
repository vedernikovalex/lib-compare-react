import { Container, Typography } from "@mui/material";
import SharedHello from "../../../packages/shared/src/components/SharedHello";

const App = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Demo MUI Dashboard
        <SharedHello text="MUI World!" />
      </Typography>
    </Container>
  );
};

export default App;
