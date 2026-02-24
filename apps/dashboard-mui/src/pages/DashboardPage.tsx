import { Box, Grid, Typography } from "@mui/material";
import {
  kpiData,
  revenueSeries,
  categoryRevenue,
  tableRows,
} from "@shared/src/data/dashboard.data";
import { useTranslations } from "@shared/src/hooks/useTranslations";
import KpiCard from "../components/KpiCard";
import DataTable from "../components/DataTable";
import RevenueLineChart from "../components/RevenueLineChart";
import RevenueCategoryChart from "../components/RevenueCategoryChart";
import type { TranslationKey } from "@shared/src/lang/index";

const DashboardPage = () => {
  const { t } = useTranslations("dashboard");

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        {t("title")}
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            data={kpi}
            label={t(kpi.labelKey as TranslationKey)}
          />
        ))}
      </Box>

      <DataTable data={tableRows} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RevenueLineChart
            data={revenueSeries}
            title={t("chart.revenueTitle")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <RevenueCategoryChart
            data={categoryRevenue}
            title={t("chart.categoryTitle")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
