import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { highlightKeys } from "@shared/src/data/homepage.data";
import { useTranslations } from "@shared/src/hooks/useTranslations";

const HomePage = () => {
  const { t } = useTranslations("homepage");
  const { t: tGlobal } = useTranslations("global");

  return (
    <Container>
      <Box display="flex" flexDirection="column" gap={4}>
        <Stack spacing={2}>
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
            <Button variant="contained" color="primary">
              {tGlobal("cta.viewMeasurementProtocol")}
            </Button>
            <Button variant="outlined" color="inherit">
              {tGlobal("cta.browseLatestResults")}
            </Button>
          </Stack>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                {t("section.whatYouWillFind")}
              </Typography>
              <Divider />
              <List
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                }}
              >
                {highlightKeys.map((key) => {
                  const typedKey = key as
                    | "featureParity"
                    | "performanceBenchmarks"
                    | "accessibilityGoals";
                  return (
                    <ListItem key={typedKey} sx={{ display: "block", p: 0 }}>
                      <Typography variant="subtitle1" component="h3">
                        {t(`highlights.${typedKey}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(`highlights.${typedKey}.description`)}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default HomePage;
