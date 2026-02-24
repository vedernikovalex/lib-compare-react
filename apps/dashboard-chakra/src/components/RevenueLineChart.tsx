import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Text } from "@chakra-ui/react";
import type { TimeSeriesPoint } from "@shared/src/types/dashboard.types";

interface Props {
  data: TimeSeriesPoint[];
  title: string;
}

const RevenueLineChart = ({ data, title }: Props) => {
  const tickFormatter = (_: string, index: number): string => {
    if (index % 10 !== 0) {
      return "";
    }
    return data[index]?.date ?? "";
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        {title}
      </Text>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(value)
                : ""
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1677ff"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueLineChart;
