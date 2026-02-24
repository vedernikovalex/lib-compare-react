export type ProductStatus = "active" | "inactive" | "pending";
export type ProductCategory =
  | "Electronics"
  | "Clothing"
  | "Books"
  | "Home"
  | "Sports";

export interface DashboardRow {
  id: string;
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  revenue: number;
  units: number;
  createdAt: string;
}

export interface KpiData {
  id: string;
  labelKey: string;
  value: number;
  change: number;
  trend: "up" | "down" | "flat";
  format: "currency" | "number" | "percent";
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface CategoryRevenue {
  category: ProductCategory;
  revenue: number;
}
