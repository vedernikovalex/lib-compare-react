import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
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

const KpiCard = ({ data, label }: Props) => {
  const TrendIcon =
    data.trend === "up"
      ? TrendingUpIcon
      : data.trend === "down"
        ? TrendingDownIcon
        : TrendingFlatIcon;

  const trendColor =
    data.trend === "up"
      ? "success.main"
      : data.trend === "down"
        ? "error.main"
        : "text.secondary";

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" component="div" fontWeight={700}>
          {formatValue(data.value, data.format)}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={1}>
          <TrendIcon sx={{ fontSize: 16, color: trendColor }} />
          <Typography variant="caption" color={trendColor}>
            {data.change > 0 ? "+" : ""}
            {data.change.toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
