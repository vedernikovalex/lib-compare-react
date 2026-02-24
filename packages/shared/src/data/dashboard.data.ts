import type {
  DashboardRow,
  KpiData,
  TimeSeriesPoint,
  CategoryRevenue,
  ProductCategory,
  ProductStatus,
} from "../types/dashboard.types";

const CATEGORIES: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
];

const PRODUCT_NAMES: Record<ProductCategory, string[]> = {
  Electronics: [
    "Wireless Headphones",
    "Bluetooth Speaker",
    "Laptop Stand",
    "USB-C Hub",
    "Mechanical Keyboard",
    "Gaming Mouse",
    "Webcam HD",
  ],
  Clothing: [
    "Merino Wool Sweater",
    "Running Shorts",
    "Yoga Pants",
    "Winter Jacket",
    "Casual T-Shirt",
    "Denim Jeans",
    "Sports Socks",
  ],
  Books: [
    "Design Patterns",
    "Clean Code",
    "The Pragmatic Programmer",
    "Refactoring",
    "Domain-Driven Design",
    "You Don't Know JS",
    "Eloquent JavaScript",
  ],
  Home: [
    "Bamboo Cutting Board",
    "Cast Iron Skillet",
    "Stainless Water Bottle",
    "Scented Candle Set",
    "Linen Throw Pillow",
    "Wooden Shelf",
    "Ceramic Mug Set",
  ],
  Sports: [
    "Resistance Bands",
    "Yoga Mat",
    "Jump Rope",
    "Pull-Up Bar",
    "Foam Roller",
    "Dumbbell Pair",
    "Kettlebell 16kg",
  ],
};

const STATUSES: ProductStatus[] = [
  "active",
  "active",
  "active",
  "inactive",
  "pending",
];

const BASE_DATE = new Date("2024-01-01");

const formatDate = (d: Date): string => {
  return d.toISOString().slice(0, 10);
};

export const tableRows: DashboardRow[] = Array.from({ length: 210 }, (_, i) => {
  const category = CATEGORIES[i % 5];
  const nameIndex = Math.floor(i / 5) % 7;
  const name = PRODUCT_NAMES[category][nameIndex];
  const status = STATUSES[i % 5];
  const revenue = Math.round(((i * 137 + 42) % 9900) + 100);
  const units = ((i * 31 + 7) % 200) + 1;
  const date = new Date(BASE_DATE);
  date.setDate(BASE_DATE.getDate() - i * 3);

  return {
    id: `row-${i + 1}`,
    name,
    category,
    status,
    revenue,
    units,
    createdAt: formatDate(date),
  };
});

const totalRevenue = tableRows.reduce((sum, r) => sum + r.revenue, 0);
const activeProducts = tableRows.filter((r) => r.status === "active").length;
const totalUnits = tableRows.reduce((sum, r) => sum + r.units, 0);
const avgOrderValue = Math.round(totalRevenue / totalUnits);

export const kpiData: KpiData[] = [
  {
    id: "totalRevenue",
    labelKey: "dashboard.kpi.totalRevenue",
    value: totalRevenue,
    change: 12.4,
    trend: "up",
    format: "currency",
  },
  {
    id: "activeProducts",
    labelKey: "dashboard.kpi.activeProducts",
    value: activeProducts,
    change: 5.2,
    trend: "up",
    format: "number",
  },
  {
    id: "totalUnits",
    labelKey: "dashboard.kpi.totalUnits",
    value: totalUnits,
    change: -2.1,
    trend: "down",
    format: "number",
  },
  {
    id: "avgOrderValue",
    labelKey: "dashboard.kpi.avgOrderValue",
    value: avgOrderValue,
    change: 8.7,
    trend: "up",
    format: "currency",
  },
];

const SERIES_BASE_DATE = new Date("2024-06-01");

export const revenueSeries: TimeSeriesPoint[] = Array.from(
  { length: 60 },
  (_, i) => {
    const date = new Date(SERIES_BASE_DATE);
    date.setDate(SERIES_BASE_DATE.getDate() - (59 - i));
    const sineOffset = Math.round(Math.sin((i * Math.PI) / 15) * 1500);
    const value = 5000 + sineOffset + ((i * 83) % 800);

    return {
      date: formatDate(date),
      value,
    };
  },
);

export const categoryRevenue: CategoryRevenue[] = CATEGORIES.map(
  (category) => ({
    category,
    revenue: tableRows
      .filter((r) => r.category === category)
      .reduce((sum, r) => sum + r.revenue, 0),
  }),
);
