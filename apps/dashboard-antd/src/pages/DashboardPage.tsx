import { Row, Col, Typography } from "antd";
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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {t("title")}
      </Typography.Title>

      <Row gutter={[16, 16]}>
        {kpiData.map((kpi) => (
          <Col key={kpi.id} xs={24} sm={12} lg={6}>
            <KpiCard data={kpi} label={t(kpi.labelKey as TranslationKey)} />
          </Col>
        ))}
      </Row>

      <DataTable data={tableRows} />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <RevenueLineChart
            data={revenueSeries}
            title={t("chart.revenueTitle")}
          />
        </Col>
        <Col xs={24} md={10}>
          <RevenueCategoryChart
            data={categoryRevenue}
            title={t("chart.categoryTitle")}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
