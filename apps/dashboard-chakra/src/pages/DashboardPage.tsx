import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import {
  kpiData,
  revenueSeries,
  categoryRevenue,
  tableRows,
} from "@shared/src/data/dashboard.data";
import { useTranslations } from "@shared/src/hooks/useTranslations";
import type { TranslationKey } from "@shared/src/lang/index";
import KpiCard from "../components/KpiCard";
import DataTable from "../components/DataTable";
import RevenueLineChart from "../components/RevenueLineChart";
import RevenueCategoryChart from "../components/RevenueCategoryChart";

const DashboardPage = () => {
  const { t } = useTranslations("dashboard");

  return (
    <Box display="flex" flexDirection="column" gap={8}>
      <Text fontSize="3xl" fontWeight="bold" as="h1">
        {t("title")}
      </Text>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={4}
      >
        {kpiData.map((kpi) => (
          <GridItem key={kpi.id}>
            <KpiCard data={kpi} label={t(kpi.labelKey as TranslationKey)} />
          </GridItem>
        ))}
      </Grid>

      <DataTable data={tableRows} />

      <Grid templateColumns={{ base: "1fr", md: "7fr 5fr" }} gap={6}>
        <GridItem>
          <RevenueLineChart
            data={revenueSeries}
            title={t("chart.revenueTitle")}
          />
        </GridItem>
        <GridItem>
          <RevenueCategoryChart
            data={categoryRevenue}
            title={t("chart.categoryTitle")}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
