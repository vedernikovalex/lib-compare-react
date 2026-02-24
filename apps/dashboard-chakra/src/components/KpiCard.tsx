import { Box, Text } from "@chakra-ui/react";
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

const TREND_SYMBOLS: Record<KpiData["trend"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

const TREND_COLORS: Record<KpiData["trend"], string> = {
  up: "green.500",
  down: "red.500",
  flat: "gray.500",
};

const KpiCard = ({ data, label }: Props) => {
  const trendColor = TREND_COLORS[data.trend];

  return (
    <Box
      flex={1}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      bg="white"
    >
      <Text fontSize="sm" color="gray.500" mb={1}>
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        {formatValue(data.value, data.format)}
      </Text>
      <Box display="flex" alignItems="center" gap={1}>
        <Text fontSize="sm" color={trendColor}>
          {TREND_SYMBOLS[data.trend]} {data.change > 0 ? "+" : ""}
          {data.change.toFixed(1)}%
        </Text>
      </Box>
    </Box>
  );
};

export default KpiCard;
