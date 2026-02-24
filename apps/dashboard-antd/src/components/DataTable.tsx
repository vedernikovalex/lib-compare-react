import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { Input, Select, Space, Tag, Typography } from "antd";
import {
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import type {
  DashboardRow,
  ProductStatus,
} from "@shared/src/types/dashboard.types";
import { useTranslations } from "@shared/src/hooks/useTranslations";

interface Props {
  data: DashboardRow[];
}

const columnHelper = createColumnHelper<DashboardRow>();

const STATUS_TAG_COLORS: Record<ProductStatus, string> = {
  active: "success",
  inactive: "default",
  pending: "warning",
};

const DataTable = ({ data }: Props) => {
  const { t } = useTranslations("dashboard");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("table.columns.name"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: t("table.columns.category"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: t("table.columns.status"),
        cell: (info) => (
          <Tag color={STATUS_TAG_COLORS[info.getValue()]}>
            {t(`table.status.${info.getValue()}`)}
          </Tag>
        ),
      }),
      columnHelper.accessor("revenue", {
        header: t("table.columns.revenue"),
        cell: (info) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(info.getValue()),
      }),
      columnHelper.accessor("units", {
        header: t("table.columns.units"),
        cell: (info) => new Intl.NumberFormat("en-US").format(info.getValue()),
      }),
      columnHelper.accessor("createdAt", {
        header: t("table.columns.createdAt"),
        cell: (info) => info.getValue(),
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("table.title")}
        </Typography.Title>
        <Input
          placeholder={t("table.searchPlaceholder")}
          prefix={<SearchOutlined />}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
      </div>

      <table
        role="grid"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #f0f0f0",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ background: "#fafafa" }}>
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : "none"
                    }
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderBottom: "1px solid #f0f0f0",
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      fontWeight: 600,
                      fontSize: 14,
                      userSelect: "none",
                    }}
                  >
                    <Space size={4}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sorted === "asc" && (
                        <CaretUpOutlined style={{ fontSize: 12 }} />
                      )}
                      {sorted === "desc" && (
                        <CaretDownOutlined style={{ fontSize: 12 }} />
                      )}
                    </Space>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              style={{ background: rowIndex % 2 === 0 ? "#fff" : "#fafafa" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: 14,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
          padding: "0 4px",
        }}
      >
        <Space>
          <Typography.Text type="secondary">
            {t("table.pagination.rowsPerPage")}
          </Typography.Text>
          <Select
            size="small"
            value={pageSize}
            onChange={(size) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: size,
                pageIndex: 0,
              }))
            }
            options={[10, 25, 50].map((s) => ({ value: s, label: String(s) }))}
            style={{ width: 70 }}
          />
        </Space>
        <Space>
          <Typography.Text type="secondary">
            {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, rowCount)}{" "}
            {t("table.pagination.of")} {rowCount}
          </Typography.Text>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ cursor: "pointer", padding: "2px 8px" }}
          >
            ‹
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ cursor: "pointer", padding: "2px 8px" }}
          >
            ›
          </button>
        </Space>
      </div>
    </div>
  );
};

export default DataTable;
