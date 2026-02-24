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
import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import type {
  DashboardRow,
  ProductStatus,
} from "@shared/src/types/dashboard.types";
import { useTranslations } from "@shared/src/hooks/useTranslations";

interface Props {
  data: DashboardRow[];
}

const columnHelper = createColumnHelper<DashboardRow>();

const STATUS_COLORS: Record<ProductStatus, string> = {
  active: "#52c41a",
  inactive: "#8c8c8c",
  pending: "#faad14",
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
        cell: (info) => {
          const status = info.getValue();
          return (
            <Box
              as="span"
              display="inline-block"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="medium"
              bg={STATUS_COLORS[status] + "22"}
              color={STATUS_COLORS[status]}
              border="1px solid"
              borderColor={STATUS_COLORS[status] + "44"}
            >
              {t(`table.status.${status}`)}
            </Box>
          );
        },
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
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">
          {t("table.title")}
        </Text>
        <Input
          placeholder={t("table.searchPlaceholder")}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          maxW="260px"
          size="sm"
        />
      </HStack>

      <Box
        overflowX="auto"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <table
          role="grid"
          style={{ width: "100%", borderCollapse: "collapse" }}
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
                        padding: "10px 12px",
                        textAlign: "left",
                        borderBottom: "1px solid #e2e8f0",
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                        fontWeight: 600,
                        fontSize: 14,
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sorted === "asc" ? " ↑" : sorted === "desc" ? " ↓" : ""}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ padding: "10px 12px", fontSize: 14 }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <HStack justify="space-between" mt={2} px={1}>
        <HStack gap={2}>
          <Text fontSize="sm">{t("table.pagination.rowsPerPage")}</Text>
          <NativeSelect.Root size="sm" width="70px">
            <NativeSelect.Field
              value={pageSize}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                }))
              }
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
        <HStack gap={2}>
          <Text fontSize="sm">
            {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, rowCount)}{" "}
            {t("table.pagination.of")} {rowCount}
          </Text>
          <Button
            size="xs"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};

export default DataTable;
