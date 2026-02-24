import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Text } from "@chakra-ui/react";
import type { CategoryRevenue } from "@shared/src/types/dashboard.types";

interface Props {
  data: CategoryRevenue[];
  title: string;
}

const RevenueCategoryChart = ({ data, title }: Props) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        {title}
      </Text>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
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
          <Bar dataKey="revenue" fill="#1677ff" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueCategoryChart;
