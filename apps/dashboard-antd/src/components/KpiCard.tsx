import { Card, Typography } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import type { KpiData } from "@shared/src/types/dashboard.types";

interface Props {
  data: KpiData;
  label: string;
}

const formatValue = (value: number, format: KpiData["format"]): string => {
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (format === "percent") {
    return `${value.toFixed(1)}%`;
  }
  return new Intl.NumberFormat("en-US").format(value);
};

const TREND_COLORS: Record<KpiData["trend"], string> = {
  up: "#52c41a",
  down: "#ff4d4f",
  flat: "#8c8c8c",
};

const KpiCard = ({ data, label }: Props) => {
  const TrendIcon =
    data.trend === "up"
      ? ArrowUpOutlined
      : data.trend === "down"
        ? ArrowDownOutlined
        : MinusOutlined;

  const trendColor = TREND_COLORS[data.trend];

  return (
    <Card size="small" style={{ flex: 1 }}>
      <Typography.Text
        type="secondary"
        style={{ display: "block", marginBottom: 4 }}
      >
        {label}
      </Typography.Text>
      <Typography.Title level={4} style={{ margin: 0, fontWeight: 700 }}>
        {formatValue(data.value, data.format)}
      </Typography.Title>
      <div
        style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}
      >
        <TrendIcon style={{ color: trendColor, fontSize: 14 }} />
        <Typography.Text style={{ color: trendColor, fontSize: 12 }}>
          {data.change > 0 ? "+" : ""}
          {data.change.toFixed(1)}%
        </Typography.Text>
      </div>
    </Card>
  );
};

export default KpiCard;
