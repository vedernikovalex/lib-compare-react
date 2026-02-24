import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
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
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={8} py={6}>
        <Stack spacing={3}>
          <Typography variant="overline" color="text.secondary">
            {tGlobal("appTitle")}
          </Typography>
          <Typography variant="h3" component="h1">
            {tGlobal("appTagline")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("intro.description")}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard")}
            >
              {tGlobal("cta.goToDashboard")}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/kanban")}
            >
              {tGlobal("cta.goToKanban")}
            </Button>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {t("libraries.title")}
          </Typography>
          <Grid container spacing={3} mt={1}>
            {libraryKeys.map((key: LibraryKey) => (
              <Grid size={{ xs: 12, sm: 4 }} key={key}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {t(`libraries.${key}.name`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(`libraries.${key}.description`)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {t("criteria.title")}
          </Typography>
          <Stack spacing={1} mt={1}>
            {criteriaKeys.map((key: CriterionKey) => (
              <Card variant="outlined" key={key}>
                <CardContent sx={{ py: "12px !important" }}>
                  <Stack direction="row" spacing={2} alignItems="baseline">
                    <Typography variant="subtitle2" sx={{ minWidth: 160 }}>
                      {t(`criteria.${key}.label`)}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ minWidth: 48 }}
                    >
                      {t(`criteria.${key}.weight`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(`criteria.${key}.description`)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
